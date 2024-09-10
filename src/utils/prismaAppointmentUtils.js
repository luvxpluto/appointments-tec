import prisma from "@/lib/prisma";
import { getCurrentWeek, getNextWeek } from "@/utils/dateUtils";
import { start } from "repl";


// Get appointments list by priority
// Lista de citas por prioridad

/* Student, ProfessorCourse
* Sudent.timesEnrolled
* Student.stars
*/

/*
* CAP SEMANA SIGUIENTE
* 1. CITAS NO RESERVADAS -> PROFESOR DEL CURSO
* 2. CITAS NO RESERVADAS SEMANA ACTUAL -> PROFESOR DEL CURSO
* 3. CITAS RESERVADAS SEMANA ACTUAL -> PROFESOR DEL CURSO 
* 4. CITAS NO RESERVADAS PROXIAMA SEMANA -> PROFESOR DEL CURSO
* 5. CITAS DISPONIBLES (RESERVADAS O NO) -> PROFESOR DEL CURSO 
* 6. CITAS NO RESERVADAS SEMANA ACTUAL -> PROFESOR DE LA MATERIA
*/

// 1. CITAS NO RESERVADAS -> PROFESOR DEL CURSO -> SEMANA ACTUAL Y SIGUIENTE
// 0 -> 1, 1->1, 2->1
async function getAppointmentsNotReservedByProfessorCourse(professorCourseId) {
    const currentWeek = getCurrentWeek();
    const nextWeek = getNextWeek();

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    id_professor_course: professorCourseId
                },
                is_available: true,
                is_reserved: false,
                start: {
                    gte: currentWeek.start,
                    lte: nextWeek.end
                }
            }
      });
      return appointments;

    } catch (error) {
      console.error("Error fetching available appointments:", error);
      throw error;
    }
}

// 2. CITAS NO RESERVADAS SEMANA ACTUAL -> PROFESOR DEL CURSO
// 0 -> 2, 0 -> 3, 
async function getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId) {
    const currentWeek = getCurrentWeek();

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    id_professor_course: professorCourseId
                },
                is_available: true,
                is_reserved: false,
                start: {
                    gte: currentWeek.start,
                    lte: currentWeek.end
                }
            }
        });
        return appointments;

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

// 3. CITAS RESERVADAS SEMANA ACTUAL -> PROFESOR DEL CURSO
async function getAppointmentsReservedCurrentWeekByProfessorCourse(professorCourseId) {
    const currentWeek = getCurrentWeek();

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    id_professor_course: professorCourseId
                },
                is_available: true,
                is_reserved: true,
                start: {
                    gte: currentWeek.start,
                    lte: currentWeek.end
                }
            }
        });
        return appointments;

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

// 4. CITAS NO RESERVADAS PROXIAMA SEMANA -> PROFESOR DEL CURSO
// 0 -> 2
async function getAppointmentsNotReservedNextWeekByProfessorCourse(professorCourseId) {
    const nextWeek = getNextWeek();

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    id_professor_course: professorCourseId
                },
                is_available: true,
                is_reserved: false,
                start: {
                    gte: nextWeek.start,
                    lte: nextWeek.end
                }
            }
        });
        return appointments;

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

// 5. CITAS DISPONIBLES (RESERVADAS O NO) -> PROFESOR DEL CURSO
// 0 -> 3
async function getAppointmentsAvailableByProfessorCourse(professorCourseId) {
    const currentWeek = getCurrentWeek();
    const nextWeek = getNextWeek();

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    id_professor_course: professorCourseId
                },
                is_available: true,
                start: {
                    gte: currentWeek.start,
                    lte: nextWeek.end
                }
            }
        });
        return appointments;

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

export default {
    getAppointmentsNotReservedByProfessorCourse,
    getAppointmentsNotReservedCurrentWeekByProfessorCourse,
    getAppointmentsReservedCurrentWeekByProfessorCourse,
    getAppointmentsNotReservedNextWeekByProfessorCourse,
    getAppointmentsAvailableByProfessorCourse
};