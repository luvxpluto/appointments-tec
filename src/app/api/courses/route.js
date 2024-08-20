// src/app/api/courses/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id_course, name } = body;

    // Basic validations
    if (!id_course || !name) {
      return NextResponse.json(
        { error: 'Course ID and name are required' },
        { status: 400 }
      );
    }

    // Create the course in the database
    const newCourse = await prisma.course.create({
      data: {
        id_course,
        name,
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