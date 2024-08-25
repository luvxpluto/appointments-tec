import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateCreateCourse(body) {
  if(!body || !body.id_student || !body.id_student.toString().trim() === "" || !body.name || !body.name.trim() === "") {
    return {valid: false, error: "Student id and name are required"};
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
      return NextResponse.json({error: "Student already exists"}, {status: 409});
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
    console.error('Error creating the student:', error);
    return NextResponse.json(
      { error: 'Error creating the student' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
    try {
        const students = await prisma.student.findMany();
        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error('Error getting the students:', error);
        return NextResponse.json(
        { error: 'Error getting the students' },
        { status: 500 }
        );
    }
}
