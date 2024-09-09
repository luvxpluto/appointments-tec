import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to retrieve the student, their enrolled courses, and appointments (if course is selected)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id_student = searchParams.get('id_student');

        // Log incoming request parameters
        console.log("Incoming request parameters:", { id_student });

        // Validación básica del parámetro id_student
        if (!id_student || id_student.trim() === "") {
            return NextResponse.json({ error: "El ID del estudiante es requerido" }, { status: 400 });
        }

        // Búsqueda del estudiante por ID
        const student = await prisma.student.findUnique({
            where: { id_student: id_student.trim() },
            include: {
                courses: {
                    include: {
                        professor_course: {
                            include: {
                                course: true,      // Incluir detalles del curso
                                professor: true,   // Incluir detalles del profesor
                            }
                        }
                    }
                }
            }
        });

        // Log the student data
        console.log("Student data:", student);

        // Verificar si el estudiante existe
        if (!student) {
            return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
        }

        // Mapeo del resultado para retornar detalles de los cursos y del profesor
        const enrolledCourses = student.courses.map((sc) => ({
            courseId: sc.professor_course.course.id_course,
            courseName: sc.professor_course.course.name,
            professorName: sc.professor_course.professor.name,
            professorId: sc.professor_course.professor.id_professor
        }));

        // Log the enrolled courses
        console.log("Enrolled courses:", enrolledCourses);

        // Inicializar la estructura para almacenar cursos con sus respectivas citas
        const coursesWithAppointments = [];

        // Iterar sobre los cursos inscritos para buscar las citas disponibles para cada uno


        //Nota: aqui es donde esta el problema, intentar conseguir
        // los datos de las citas de cada curso en appointmentSchedule, con eso resuelto debería funcionar lo demás
        //Hay un error con start y end time por el formato, porque a priori son un string en el esquema y aquí se trabaja
        // como un string, pero dice que prisma espera un datetime, entonces que putas
        //Hubo un  problema con number_appointments_reserve, por alguna razón es como si no existiera en el esquema pero tecnicamente si



        for (const course of enrolledCourses) {

            const professorCourse = await prisma.professorCourse.findFirst({
                where: {
                    id_course: course.courseId,
                    id_professor: course.professorId
                },
                select: {
                    id_professor_course: true
                }
            });

            console.log('Professor course data:', professorCourse);

            if (!professorCourse) {
                console.log("No se encontró el curso y profesor especificados para courseId:", course.courseId);
                continue; // Si no se encuentra el curso-profesor, se salta al siguiente curso
            }

            // Buscar las citas asociadas al curso-profesor encontrado
            const appointments = await prisma.appointmentSchedule.findMany({
                where: {
                    id_professor_course: professorCourse.id_professor_course
                },
                select: {
                    start_time: true,
                    end_time: true,
                    number_appointments: true,
                    number_appointments_reserve: true,
                    day_of_week: true
                }
            });

            // Convertir los campos start_time y end_time de string a formato Date (si es necesario)
            const formattedAppointments = appointments.map(appointment => ({
                ...appointment,
                start_time: new Date(`1970-01-01T${appointment.start_time}:00`),  // Convertir la hora a un objeto Date
                end_time: new Date(`1970-01-01T${appointment.end_time}:00`)       // Convertir la hora a un objeto Date
            }));

            // Log the appointments data
            console.log("Appointments data for courseId:", course.courseId, formattedAppointments);

            // Añadir el curso con sus citas al array final
            coursesWithAppointments.push({
                courseId: course.courseId,
                courseName: course.courseName,
                professorName: course.professorName,
                appointments: formattedAppointments // Asociar las citas encontradas al curso
            });
        }

        // Respuesta con los detalles del estudiante, sus cursos y las citas correspondientes
        const response = {
            studentName: student.name,
            courses: coursesWithAppointments // Cursos con citas incluidas
        };

        // Log the final response
        console.log("Response data:", response);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error al obtener la información del estudiante y citas:", error.message);
        return NextResponse.json({ error: "Error obteniendo la información del estudiante y citas" }, { status: 500 });
    }
}
