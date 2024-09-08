import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getProfessor } from "@/app/api/professors/route";
import { getCourse } from "@/app/api/courses/route";

// Función para validar el cuerpo de la solicitud
function validateAsignCourse(body) {
    if (!body || !body.id_course || body.id_course.trim() === "" || !body.id_professor || body.id_professor.trim() === "") {
        return { valid: false, error: "El id del curso y el id del profesor son requeridos" };
    }
    return { valid: true };
}

// Función para obtener el curso ya asignado al profesor
async function getProfessorCourse(body) {
    const existingProfessorCourse = await prisma.professorCourse.findFirst({
        where: {
            id_course: body.id_course.trim(),
            id_professor: body.id_professor.trim(),
        },
    });
    return existingProfessorCourse;
}

// Función para asignar un curso a un profesor
async function createProfessorCourse(body) {
    const newProfessorCourse = await prisma.professorCourse.create({
        data: {
            id_course: body.id_course.trim(),
            id_professor: body.id_professor.trim(),
        },
    });
    return newProfessorCourse;
}

// Método POST para asignar un curso a un profesor
export async function POST(request) {
    try {
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        const validation = validateAsignCourse(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Verificar si el curso existe
        const existingCourse = await getCourse(body);
        if (!existingCourse) {
            return NextResponse.json({ error: "No existe el curso" }, { status: 404 });
        }

        // Verificar si el profesor existe
        const existingProfessor = await getProfessor(body);
        if (!existingProfessor) {
            return NextResponse.json({ error: "No existe el profesor" }, { status: 404 });
        }

        // Verificar si el curso ya está asignado al profesor
        const existingCourseProfesor = await getProfessorCourse(body);
        if (existingCourseProfesor) {
            return NextResponse.json({ error: "El curso ya está asignado al profesor" }, { status: 409 });
        }

        // Asignar el curso al profesor
        const newProfessorCourse = await createProfessorCourse(body);
        return NextResponse.json(newProfessorCourse, { status: 201 });
    } catch (error) {
        console.error("Error al asignarle el curso al profesor:", error);
        return NextResponse.json({ error: "Error al asignarle el curso al profesor" }, { status: 500 });
    }
}

// Función para obtener todos los cursos asignados a profesores
async function getProfessorCourses() {
    const professorCourses = await prisma.professorCourse.findMany({
        include: {
            course: {
                select: {
                    id_course: true,
                    name: true,
                },
            },
            professor: {
                select: {
                    id_professor: true,
                    name: true,
                },
            },
        },
    });

    // Formatear los resultados en un formato adecuado para el frontend
    const result = professorCourses.map((pc) => ({
        id: pc.id_professor_course.toString(),
        courseId: pc.course.id_course.toString(),
        courseName: pc.course.name,
        professorId: pc.professor.id_professor.toString(),
        professorName: pc.professor.name,
    }));
    return result;
}

// Método GET para obtener los cursos asignados a profesores
export async function GET(request) {
    try {
        const result = await getProfessorCourses();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error obteniendo los cursos asignados al profesor:", error);
        return NextResponse.json({ error: "Error obteniendo los cursos asignados al profesor" }, { status: 500 });
    }
}
