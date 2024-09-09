import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const course_id = searchParams.get('course_id');
        const professor_id = searchParams.get('professor_id');

        if (!course_id || !professor_id) {
            return NextResponse.json({ error: "El ID del curso y del profesor son requeridos" }, { status: 400 });
        }

        // Buscar el id_professor_course en la tabla ProfessorCourse con el id del curso y del profesor
        const professorCourse = await prisma.professorCourse.findFirst({
            where: {
                id_course: course_id,
                id_professor: parseInt(professor_id)
            },
            select: {
                id_professor_course: true 
            }
        });

        if (!professorCourse) {
            return NextResponse.json({ error: "No se encontró el curso o profesor para este estudiante" }, { status: 404 });
        }

        // Obtener las citas del horario del profesor
        const appointments = await prisma.appointmentSchedule.findMany({
            where: {
                id_professor_course: professorCourse.id_professor_course
            },
            include: {
                appointments: true
            }
        });

        // Procesar las citas para devolver la estructura correcta
        const result = appointments.map((schedule) => {
            return schedule.appointments.map((appointment) => {
                const startTime = new Date(appointment.date_time.toISOString().split('T')[0] + 'T' + schedule.start_time + ':00.000Z');
                const endTime = new Date(appointment.date_time.toISOString().split('T')[0] + 'T' + schedule.end_time + ':00.000Z');
                return {
                    date: appointment.date_time.toISOString().split('T')[0], 
                    timeRange: startTime.toISOString().split('T')[1].substring(0, 5) + ' - ' + endTime.toISOString().split('T')[1].substring(0, 5) // Usa las cadenas de tiempo
                };
            });
        }).flat(); 

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las citas:", error.message, error.stack);
        return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
    }
}
