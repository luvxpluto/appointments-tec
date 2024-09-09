import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function validateAsignCourse(body) {
    if (!body || !body.id_course || body.id_course.trim() === "" || !body.id_professor || body.id_professor.trim() === "") {
        return { valid: false, error: "El id del curso y el profesor son requeridos" };
    }
    return { valid: true };
}

async function getProfessor(body) {
    return prisma.professor.findUnique({
        where: { id_professor: body.id_professor.trim() }
    });
}

async function getCourse(body) {
    return prisma.course.findUnique({
        where: { id_course: body.id_course.trim() }
    });
}

async function getProfessorCourse(body) {
    return prisma.professorCourse.findFirst({
        where: {
            id_professor: body.id_professor.trim(),
            id_course: body.id_course.trim(),
        },
    });
}

async function createProfessorCourse(body) {
    return prisma.professorCourse.create({
        data: {
            id_course: body.id_course.trim(),
            id_professor: body.id_professor.trim(),
        },
    });
}

// POST method to assign a course to a professor
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validation = validateAsignCourse(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Check if the course and professor exist
        const existingCourse = await getCourse(body);
        if (!existingCourse) {
            return NextResponse.json({ error: "No existe el curso" }, { status: 404 });
        }

        const existingProfessor = await getProfessor(body);
        if (!existingProfessor) {
            return NextResponse.json({ error: "No existe el profesor" }, { status: 404 });
        }

        // Check if the course is already assigned to the professor
        const existingProfessorCourse = await getProfessorCourse(body);
        if (existingProfessorCourse) {
            return NextResponse.json({ error: "El curso ya está asignado al profesor" }, { status: 409 });
        }

        // Assign the course to the professor
        const newProfessorCourse = await createProfessorCourse(body);
        return NextResponse.json(newProfessorCourse, { status: 201 });
    } catch (error) {
        console.error("Error assigning course to professor:", error);
        return NextResponse.json({ error: "Error al asignar el curso al profesor" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const professorCourses = await prisma.professorCourse.findMany({
            include: {
                course: true,
                professor: true
            }
        });

        const result = professorCourses.map(pc => ({
            id: pc.id_professor_course.toString(),
            courseId: pc.id_course.toString(),
            courseName: pc.course.name,
            professorId: pc.id_professor.toString(),
            professorName: pc.professor.name
        }));

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching professor courses:", error);
        return NextResponse.json({ error: "Error obteniendo los cursos asignados al profesor" }, { status: 500 });
    }
}
