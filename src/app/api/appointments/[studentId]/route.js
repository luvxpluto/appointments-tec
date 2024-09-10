import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { studentId } = params;

    try {
        const studentCourses = await prisma.studentCourse.findMany({
            where: {
                id_student: studentId.toString().trim(),
            },
            include: {
                professor_course: { // No necesitamos especificar 'id_professor_course' aquí
                    include: {
                        course: true,  // Incluye el nombre y código del curso
                        professor: true,  // Incluye el nombre del profesor
                        appointments: {   // Incluye los horarios de consulta
                            include: {
                                appointments: true  // Incluye las citas asociadas
                            }
                        }
                    }
                }
            }
        });
        
        // Formateamos los datos obtenidos para devolverlos en el formato requerido
        const formattedData = studentCourses.map(studentCourse => {
            const { professor_course } = studentCourse;
            const totalAppointments = professor_course.appointments.reduce((total, schedule) => {
                return total + schedule.number_appointments;
            }, 0);
            const reservedAppointments = professor_course.appointments.reduce((total, schedule) => {
                return total + schedule.number_appointments_reserve;
            }, 0);
        
            return {
                professorCourseId: professor_course.id_professor_course,
                courseCode: professor_course.course.id_course,
                courseName: professor_course.course.name,
                professorName: professor_course.professor.name,
                schedules: professor_course.appointments.map(schedule => ({
                    day: schedule.day_of_week,
                    startTime: schedule.start_time,
                    endTime: schedule.end_time,
                })),
                totalAppointments,
                reservedAppointments,
            };
        });
        
        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las citas:", error.message, error.stack);
        return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
    }
}
