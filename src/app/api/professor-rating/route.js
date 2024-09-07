import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Valida la entrada para asegurarse de que los campos requeridos estén presentes
function validateRating(body) {
    if (!body || !body.id_student || body.id_student.trim() === "" || !body.id_course || body.id_course.trim() === "" || typeof body.stars_rating !== 'number') {
        return { valid: false, error: "El id del estudiante, curso y la calificación (rating) son requeridos." };
    }
    return { valid: true };
}

// Verifica si ya existe una calificación para ese estudiante en el curso
async function getStudentCourse(body) {
    const existingStudentCourse = await prisma.studentCourse.findFirst({
        where: {
            id_student: body.id_student.trim(),
            professor_course: {
                id_course: body.id_course.trim(), // Relación del curso
            }
        },
    });
    return existingStudentCourse;
}

// Actualiza el rating (calificación) de un estudiante en el curso
async function updateStudentCourseRating(body) {
    const updatedStudentCourse = await prisma.studentCourse.update({
        where: {
            id_student_course: body.id_student_course,
        },
        data: {
            stars_rating: body.stars_rating,
        },
    });
    return updatedStudentCourse;
}

// POST method para asignar una calificación al estudiante
export async function POST(request) {
    try {
        const body = await request.json();

        // Valida la solicitud
        const validation = validateRating(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Verifica si el estudiante ya está en el curso
        const existingStudentCourse = await getStudentCourse(body);
        if (!existingStudentCourse) {
            return NextResponse.json({ error: "El estudiante no está inscrito en este curso." }, { status: 404 });
        }

        // Actualiza la calificación del estudiante
        const updatedStudentCourse = await updateStudentCourseRating({
            id_student_course: existingStudentCourse.id_student_course,
            stars_rating: body.stars_rating,
        });

        return NextResponse.json(updatedStudentCourse, { status: 200 });
    } catch (error) {
        console.error("Error al asignar la calificación:", error);
        return NextResponse.json({ error: "Error al asignar la calificación al estudiante." }, { status: 500 });
    }
}
