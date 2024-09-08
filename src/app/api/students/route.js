import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateCreateCourse(body) {
  if(!body || !body.id_student || !body.id_student.toString().trim() === "" || !body.name || !body.name.trim() === "") {
    return {valid: false, error: "El id y nombre del estudiante son requeridos"};
  }
  return {valid: true};
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = validateCreateCourse(body);
    if(!validation.valid) {
      return NextResponse.json({error: validation.error}, {status: 400});
    }

    // Check if the student already exists
    const existingStudent = await prisma.student.findUnique({
      where: {
        id_student: body.id_student.toString().trim(),
      }
    });
    
    if(existingStudent) {
      return NextResponse.json({error: "El estudiante ya existe"}, {status: 409});
    }

    // Create the student in the database
    const newStudent = await prisma.student.create({
      data: {
        id_student: body.id_student.toString().trim(),
        name: body.name.trim(),
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  
  } catch (error) {
    console.error('Error al crear el estudiante:', error);
    return NextResponse.json(
      { error: 'Error al crear el estudiante' },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        const students = await prisma.student.findMany();
        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        return NextResponse.json(
        { error: 'Error al obetener los estudiantes' },
        { status: 500 }
        );
    }
}
