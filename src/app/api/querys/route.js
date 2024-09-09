import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma ORM para interactuar con la base de datos

// Función para validar el cuerpo de la solicitud de citas
function validateAppointmentQuery(body) {
    if (!body || !body.id_course || body.id_course.trim() === "" || !body.id_professor || body.id_professor.trim() === "") {
        return { valid: false, error: "El id del curso y el id del profesor son requeridos" };
    }
    return { valid: true };
}

// Función para obtener las citas (appointments) para un profesor y un curso específico
async function getProfessorAppointments(body) {
    const appointments = await prisma.appointment.findMany({
        where: {
            schedule: {
                professorCourse: {
                    id_course: body.id_course.trim(),
                    id_professor: body.id_professor.trim(),
                },
            },
        },
        include: {
            student: {
                select: {
                    id_student: true,
                    name: true,
                },
            },
        },
    });
    return appointments;
}

// Método POST para consultar citas de un profesor y curso específico
export async function POST(request) {
    try {
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        const validation = validateAppointmentQuery(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Obtener las citas para el curso y profesor especificados
        const appointments = await getProfessorAppointments(body);
        if (appointments.length === 0) {
            return NextResponse.json({ error: "No se encontraron citas para el curso y profesor especificados" }, { status: 404 });
        }

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
    }
}

// Función para obtener todas las citas (appointments) registradas
async function getAllAppointments() {
    const allAppointments = await prisma.appointment.findMany({
        include: {
            schedule: {
                include: {
                    professorCourse: {
                        include: {
                            course: {
                                select: {
                                    name: true,
                                },
                            },
                            professor: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
            student: {
                select: {
                    id_student: true,
                    name: true,
                },
            },
        },
    });

    // Formatear los resultados para el frontend
    const result = allAppointments.map((appointment) => ({
        id: appointment.id_appointment.toString(),
        date: appointment.date_time,
        course: appointment.schedule.professorCourse.course.name,
        professor: appointment.schedule.professorCourse.professor.name,
        student: appointment.student ? appointment.student.name : "Sin asignar",
        is_reserved: appointment.is_reserved,
    }));
    return result;
}

// Método GET para obtener todas las citas (appointments)
export async function GET(request) {
    try {
        const appointments = await getAllAppointments();
        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error obteniendo las citas:", error);
        return NextResponse.json({ error: "Error obteniendo las citas" }, { status: 500 });
    }
}
