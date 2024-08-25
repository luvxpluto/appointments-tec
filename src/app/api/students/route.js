import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateCreateCourse(body) {
  if(!body || !body.id_student || !body.id_course.trim() === "" || !body.name || !body.name.trim() === "") {
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

    // Check if the course already exists
    const existingCourse = await prisma.student.findUnique({
      where: {
        id_student: body.id_student.trim(),
      }
    });
    if(existingCourse) {
      return NextResponse.json({error: "Student already exists"}, {status: 409});
    }

    // Create the course in the database
    const newCourse = await prisma.student.create({
      data: {
        id_student: body.id_student.trim(),
        name: body.name.trim(),
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  
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
        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error('Error getting the students:', error);
        return NextResponse.json(
        { error: 'Error getting the courses' },
        { status: 500 }
        );
    }
}
