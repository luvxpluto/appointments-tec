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

    // Verificar si el carnet del estudiante existe en la base de datos
    const student = await prisma.student.findUnique({
      where: { id_student: body.id_student }
    });

    if (!student) {
      return NextResponse.json({ error: "El carnet del estudiante no existe" }, { status: 404 });
    }

    // Convertir id_professor_course a número
    const idProfessorCourse = parseInt(body.id_professor_course, 10);
    if (isNaN(idProfessorCourse)) {
      return NextResponse.json({ error: "Invalid professor course ID" }, { status: 400 });
    }

    // Verificar si el estudiante ya está registrado en el curso
    const existingEnrollment = await prisma.studentCourse.findUnique({
      where: {
        id_student_id_professor_course: {
          id_student: body.id_student,
          id_professor_course: idProfessorCourse,
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "El estudiante ya está registrado en este curso" }, { status: 409 });
    }

    // Crear la relación entre estudiante y curso
    const newStudentCourse = await prisma.studentCourse.create({
      data: {
        id_student: body.id_student,
        id_professor_course: idProfessorCourse,
        enrollment_count: 1,  // Inicializa con 1
        stars_rating: 0,      // Inicializa con 0
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
