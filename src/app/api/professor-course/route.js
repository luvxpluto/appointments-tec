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
}