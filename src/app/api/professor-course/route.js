<<<<<<< HEAD
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateProfessorCourse(body) {
  if (!body || !body.id_professor || !body.id_course) {
    return { valid: false, error: "Professor ID and Course ID are required" };
  }
  return { valid: true };
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar el cuerpo de la solicitud
    const validation = validateProfessorCourse(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Verificar si la relación entre el profesor y el curso ya existe
    const existingRelation = await prisma.professorCourse.findUnique({
      where: {
        id_professor_id_course: {
          id_professor: body.id_professor,
          id_course: body.id_course,
        }
      }
    });

    if (existingRelation) {
      return NextResponse.json({ error: "This professor is already assigned to the course" }, { status: 409 });
    }

    // Crear la relación entre el profesor y el curso en la base de datos
    const newProfessorCourse = await prisma.professorCourse.create({
      data: {
        id_professor: body.id_professor,
        id_course: body.id_course,
      },
    });

    return NextResponse.json(newProfessorCourse, { status: 201 });

  } catch (error) {
    console.error('Error creating the professor-course relationship:', error);
    return NextResponse.json(
      { error: 'Error creating the professor-course relationship' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const professorCourses = await prisma.professorCourse.findMany({
      include: {
        professor: true,
        course: true,
      },
    });
    return NextResponse.json(professorCourses, { status: 200 });
  } catch (error) {
    console.error('Error getting the professor-course relationships:', error);
    return NextResponse.json(
      { error: 'Error getting the professor-course relationships' },
      { status: 500 }
    );
  }
=======
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getProfessor } from "@/app/api/professors/route";
import { getCourse } from "@/app/api/courses/route";

function validateAsignCourse(body) {
    if (!body || !body.id_course || body.id_course.trim() === "" || !body.id_professor || body.id_professor.trim() === "") {
        return { valid: false, error: "El id del curso y el profesor son requeridos" };
    }
    return { valid: true };
}

async function getProfessorCourse(body) {
    const existingProfessorCourse = await prisma.professorCourse.findFirst({
        where: {
            id_course: body.id_course.trim(),
            id_professor: body.id_professor.trim(),
        },
    });
    return existingProfessorCourse;
}

async function createProfessorCourse(body) {
    const newProfessorCourse = await prisma.professorCourse.create({
        data: {
            id_course: body.id_course.trim(),
            id_professor: body.id_professor.trim(),
        },
    });
    return newProfessorCourse;
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
        const existingCourse = await getCourse(body);
        if (!existingCourse) {
            return NextResponse.json({ error: "No existe el curso" }, { status: 404 });
        }

        // Check if the professor already exists
        const existingProfessor = await getProfessor(body);
        if (!existingProfessor) {
            return NextResponse.json({ error: "No existe el profesor" }, { status: 404 });
        }

        const existingCourseProfesor = await getProfessorCourse(body);
        if(existingCourseProfesor){
            return NextResponse.json({ error: "El curso ya esta asignado al profesor" }, { status: 409 });
        }

        // Assign the course to the professor
        const newProfessorCourse = await createProfessorCourse(body);
        return NextResponse.json(newProfessorCourse, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al asignarle el curso al profesor:" },{ status: 500 });
    }
}

async function getProfessorCourses() {
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
    return result;
}

export async function GET(request) {
    try {
        const result = await getProfessorCourses();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error obteniendo los cursos asignados al profesor" },{ status: 500 });
    }
>>>>>>> f8cc58186a681dd18cab8bfe3cc4caa927bf2f03
}