import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function validateCreateCourse(body) {
  if(!body || !body.id_course || !body.id_course.trim() === "" || !body.name || !body.name.trim() === "") {
    return {valid: false, error: "El id y nombre del curso son requeridos"};
  }
  return {valid: true};
}

async function getCourse(body) {
  const existingCourse = await prisma.course.findFirst({
    where: {
      id_course: body.id_course.trim(),
    },
  });
  return existingCourse;
}

async function createCourse(body) {
  const newCourse = await prisma.course.create({
    data: {
      id_course: body.id_course.trim(),
      name: body.name.trim(),
    },
  });
  return newCourse;
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
    const existingCourse = await getCourse(body);
    if(existingCourse) {
      return NextResponse.json({error: "El curso ya existe"}, {status: 409});
    }

    // Create the course in the database
    const newCourse = await createCourse(body);
    return NextResponse.json(newCourse, { status: 201 });
  
  } catch (error) {
    console.error('Error al crear el curso:', error);
    return NextResponse.json(
      { error: 'Error al crear el curso' },
      { status: 500 }
    );
  }
}


async function getCourses() {
  const courses = await prisma.course.findMany();
  return courses;
}

export async function GET() {
    try {
        const courses = await getCourses();
        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener los cursos' },{ status: 500 });
    }
}
