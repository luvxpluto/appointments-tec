import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma ORM para interactuar con la base de datos

// Función para validar el cuerpo de la solicitud de citas por profesor y curso
function validateAppointmentQuery(body) {
    if (!body || !body.id_course || body.id_course.trim() === "" || !body.id_professor || body.id_professor.trim() === "") {
        return { valid: false, error: "El id del curso y el id del profesor son requeridos" };
    }
    return { valid: true };
}

// Función para validar el cuerpo de la solicitud de citas por estudiante
function validateStudentQuery(body) {
    if (!body || !body.id_student || body.id_student.trim() === "") {
        return { valid: false, error: "El id del estudiante es requerido" };
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
        },
    });

    return appointments.map((appointment) => ({
        id: appointment.id_appointment,
        date: appointment.date_time,
        student: appointment.student ? appointment.student.name : "Sin asignar",
        course: appointment.schedule.professorCourse.course.name,
        professor: appointment.schedule.professorCourse.professor.name,
        is_reserved: appointment.is_reserved,
    }));
}

// Función para obtener las citas (appointments) para un estudiante específico
async function getStudentAppointments(body) {

    const appointments = await prisma.appointment.findMany({
        where: {
            id_student: body.id_student.trim(),
        },
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
        },
    });

    if (appointments.length === 0) {
        console.log(`No se encontraron citas para el id del estudiante: ${body.id_student}`);
    }

    return appointments.map((appointment) => ({
        id: appointment.id_appointment,
        date: appointment.date_time,
        course: appointment.schedule.professorCourse.course.name,
        professor: appointment.schedule.professorCourse.professor.name,
        is_reserved: appointment.is_reserved,
    }));
}

// Método POST para manejar citas de profesor/curso y estudiante
export async function POST(request) {
    try {
        const body = await request.json();

        // Verificar si es una consulta de citas por profesor y curso
        if (body.id_course && body.id_professor) {
            const validation = validateAppointmentQuery(body);
            if (!validation.valid) {
                console.log("Validación fallida:", validation.error); // Log para depurar
                return NextResponse.json({ error: validation.error }, { status: 400 });
            }

            const appointments = await getProfessorAppointments(body);
            if (appointments.length === 0) {
                return NextResponse.json({ error: "No se encontraron citas para el curso y profesor especificados" }, { status: 404 });
            }

            console.log("Citas enviadas:", appointments); // Log para depurar
            return NextResponse.json(appointments, { status: 200 });
        }

        // Verificar si es una consulta de citas por estudiante
        if (body.id_student) {
            const validation = validateStudentQuery(body);
            if (!validation.valid) {
                return NextResponse.json({ error: validation.error }, { status: 400 });
            }

            const appointments = await getStudentAppointments(body);
            if (appointments.length === 0) {
                return NextResponse.json({ error: "No se encontraron citas para el estudiante especificado" }, { status: 404 });
            }

            return NextResponse.json(appointments, { status: 200 });
        }

        return NextResponse.json({ error: "Faltan parámetros en la solicitud" }, { status: 400 });
    } catch (error) {
        console.error("Error al obtener las citas:", error); // Log de error
        return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
    }
}

// Método GET para obtener todas las citas (appointments)
export async function GET() {
    try {
        console.log("Solicitud GET recibida"); // Log para depurar

        const appointments = await prisma.appointment.findMany({
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

        const formattedAppointments = appointments.map((appointment) => ({
            id: appointment.id_appointment.toString(),
            date: appointment.date_time,
            course: appointment.schedule.professorCourse.course.name,
            professor: appointment.schedule.professorCourse.professor.name,
            student: appointment.student ? appointment.student.name : "Sin asignar",
            is_reserved: appointment.is_reserved,
        }));

        return NextResponse.json(formattedAppointments, { status: 200 });
    } catch (error) {
        console.error("Error obteniendo las citas:", error); // Log de error
        return NextResponse.json({ error: "Error obteniendo las citas" }, { status: 500 });
    }
}
