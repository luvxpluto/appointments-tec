import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateStudentCourse(body) {
  if (!body || !body.id_student || !body.id_professor_course) {
    return { valid: false, error: "Student ID and ProfessorCourse ID are required" };
  }
  return { valid: true };
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar el cuerpo de la solicitud
    const validation = validateStudentCourse(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Verificar si el estudiante ya está registrado en el curso
    const existingEnrollment = await prisma.studentCourse.findUnique({
      where: {
        id_student_id_professor_course: {
          id_student: body.id_student,
          id_professor_course: body.id_professor_course,
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "The student is already registered in this course" }, { status: 409 });
    }

    // Crear la relación entre estudiante y curso
    const newStudentCourse = await prisma.studentCourse.create({
      data: {
        id_student: body.id_student,
        id_professor_course: body.id_professor_course,
        enrollment_count: 1,  // Inicializa con 1, puedes ajustar según lo necesario
        stars_rating: 0,      // Inicializa con 0, puedes ajustar según lo necesario
      },
    });

    return NextResponse.json(newStudentCourse, { status: 201 });

  } catch (error) {
    console.error('Error registering the student in the course:', error);
    return NextResponse.json(
      { error: 'Error registering the student in the course' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const studentCourses = await prisma.studentCourse.findMany({
      include: {
        student: true,
        professorCourse: {
          include: {
            course: true,
            professor: true,
          },
        },
      },
    });
    return NextResponse.json(studentCourses, { status: 200 });
  } catch (error) {
    console.error('Error getting the student-course relationships:', error);
    return NextResponse.json(
      { error: 'Error getting the student-course relationships' },
      { status: 500 }
    );
  }
}
