import prisma from "@/lib/prisma";
import { getCurrentWeek, getNextWeek } from "@/utils/dateUtils";

function formattedData(appointments) {
    const formattedAppointments = appointments.map((appointment) => {
        const formatted = {
            id_appointment: appointment.id_appointment,
            date_time: appointment.date_time,
            is_available: appointment.is_available,
            is_reserved: appointment.is_reserved,
            duration: appointment.schedule.duration_appointment, 
            course_name: appointment.schedule.professorCourse.course.name,
            professor_name: appointment.schedule.professorCourse.professor.name,
        };

        return formatted;
    });
    return formattedAppointments;
}

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
                date_time: {
                    gte: currentWeek.start,
                    lte: nextWeek.end
                }
            },
            include: {
                schedule: {
                    include: {
                        professorCourse: {
                            include: {
                                course: true,
                                professor: true
                            }
                        }
                    }
                }
            }
      });
      return formattedData(appointments);

    } catch (error) {
      console.error("Error fetching available appointments:", error);
      throw error;
    }
}


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
                date_time: {
                    gte: currentWeek.start,
                    lte: currentWeek.end
                }
            },
            include: {
                schedule: {
                    include: {
                        professorCourse: {
                            include: {
                                course: true,
                                professor: true
                            }
                        }
                    }
                }
            }
        });
        return formattedData(appointments);

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
                date_time: {
                    gte: currentWeek.start,
                    lte: currentWeek.end
                }
            },
            include: {
                schedule: {
                    include: {
                        professorCourse: {
                            include: {
                                course: true,
                                professor: true
                            }
                        }
                    }
                }
            }
        });
        return formattedData(appointments);

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

async function getAppointmentsReservedNextWeekByProfessorCourse(professorCourseId) {
    const nextWeek = getNextWeek();

    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                schedule: {
                    id_professor_course: professorCourseId
                },
                is_available: true,
                is_reserved: true,
                date_time: {
                    gte: nextWeek.start,
                    lte: nextWeek.end
                }
            },
            include: {
                schedule: {
                    include: {
                        professorCourse: {
                            include: {
                                course: true,
                                professor: true
                            }
                        }
                    }
                }
            }
        });
        return formattedData(appointments);

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
                date_time: {
                    gte: nextWeek.start,
                    lte: nextWeek.end
                }
            },
            include: {
                schedule: {
                    include: {
                        professorCourse: {
                            include: {
                                course: true,
                                professor: true
                            }
                        }
                    }
                }
            }
        });
        return formattedData(appointments);

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

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
                date_time: {
                    gte: currentWeek.start,
                    lte: nextWeek.end
                }
            },
            include: {
                schedule: {
                    include: {
                        professorCourse: {
                            include: {
                                course: true,
                                professor: true
                            }
                        }
                    }
                }
            }
        });
        return formattedData(appointments);

    } catch (error) {
        console.error("Error fetching available appointments:", error);
        throw error;
    }
}

export {
    getAppointmentsNotReservedByProfessorCourse,
    getAppointmentsNotReservedCurrentWeekByProfessorCourse,
    getAppointmentsReservedCurrentWeekByProfessorCourse,
    getAppointmentsNotReservedNextWeekByProfessorCourse,
    getAppointmentsAvailableByProfessorCourse,
    getAppointmentsReservedNextWeekByProfessorCourse
};