import { NextResponse } from 'next/server';
import getAppointmentsListByPriority from '@/utils/appointmentUtils';
import prisma from '@/lib/prisma'; // Asegúrate de tener este archivo para la instancia de PrismaClient

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id_student = searchParams.get('id_student');
  const professorCourseId = searchParams.get('professorCourseId');

  if (!id_student || !professorCourseId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id_student: id_student },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const appointmentsList = await getAppointmentsListByPriority(student, parseInt(professorCourseId));
    return NextResponse.json(appointmentsList);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

//Actualizar user y is available
export async function PUT(request){
    try {
        const body = await request.json();
        const { id_student, id_appointment } = body;
        const student = await prisma.student.findUnique({
        where: { id_student: id_student },
        });
    
        if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
    
        const appointment = await prisma.appointment.findUnique({
        where: { id_appointment: id_appointment },
        });
    
        if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }
    
        const updatedAppointment = await prisma.appointment.update({
        where: { id_appointment: id_appointment },
        data: {
            id_student: id_student,
            is_available: false,
        },
        });
    
        return NextResponse.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}