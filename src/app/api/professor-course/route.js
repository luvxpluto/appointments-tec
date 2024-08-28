import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function validateAsignCourse(body) {
    if (!body || !body.id_course || body.id_course.trim() === "" || !body.id_professor || body.id_professor.trim() === "") {
        return { valid: false, error: "El id del curso y el profesor son requeridos" };
    }
    return { valid: true };
}

//POST method to assign a course to a professor
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validation = validateAsignCourse(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Check if the course already exists
        const existingCourse = await prisma.course.findUnique({
            where: {
                id_course: body.id_course.trim(),
            }
        });
        if (!existingCourse) {
            return NextResponse.json({ error: "No existe el curso" }, { status: 404 });
        }

        // Check if the professor already exists
        const existingProfessor = await prisma.professor.findUnique({
            where: {
                id_professor: body.id_professor.trim(),
            }
        });
        if (!existingProfessor) {
            return NextResponse.json({ error: "No existe el profesor" }, { status: 404 });
        }

        const existingCourseProfesor = await prisma.professorCourse.findUnique({
            where:{
                id_professor_id_course: {
                    id_course: body.id_course.trim(),
                    id_professor: body.id_professor.trim(),
                }
            }
        })
        if(existingCourseProfesor){
            return NextResponse.json({ error: "El curso ya esta asignado al profesor" }, { status: 409 });
        }

        // Assign the course to the professor
        const newProfessorCourse = await prisma.professorCourse.create({
            data: {
                id_course: body.id_course.trim(),
                id_professor: body.id_professor.trim(),
            },
        });

        return NextResponse.json(newProfessorCourse, { status: 201 });

    } catch (error) {
        console.error("Error al asignarle el curso al profesor:", error);
        return NextResponse.json(
            { error: "Error al asignarle el curso al profesor:" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const professorCourses = await prisma.professorCourse.findMany({
            include: {
                id_professor_course: true,
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
        console.error("Error obteniendo los cursos asignados al profesor", error);
        return NextResponse.json(
            { error: "Error obteniendo los cursos asignados al profesor" },
            { status: 500 }
        );
    }
}