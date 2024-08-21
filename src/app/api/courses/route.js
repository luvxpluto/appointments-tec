import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateCreateCourse(body) {
  if(!body || !body.id_course.trim() === "" || !body.name.trim() === "") {
    return {valid: false, error: "Course ID and name are required"};
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
    const existingCourse = await prisma.course.findUnique({
      where: {
        id_course: body.id_course.trim(),
      }
    });
    if(existingCourse) {
      return NextResponse.json({error: "Course already exists"}, {status: 409});
    }

    // Create the course in the database
    const newCourse = await prisma.course.create({
      data: {
        id_course: body.id_course.trim(),
        name: body.name.trim(),
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  
  } catch (error) {
    console.error('Error creating the course:', error);
    return NextResponse.json(
      { error: 'Error creating the course' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
    try {
        const courses = await prisma.course.findMany();
        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error('Error getting the courses:', error);
        return NextResponse.json(
        { error: 'Error getting the courses' },
        { status: 500 }
        );
    }
}
