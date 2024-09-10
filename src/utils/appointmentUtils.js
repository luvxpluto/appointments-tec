import {
    getAppointmentsNotReservedByProfessorCourse,
    getAppointmentsNotReservedCurrentWeekByProfessorCourse,
    getAppointmentsReservedCurrentWeekByProfessorCourse,
    getAppointmentsNotReservedNextWeekByProfessorCourse,
    getAppointmentsAvailableByProfessorCourse
} from "@/utils/prismaAppointmentUtils";



/**
 * timesEnrolled -> 0
 * timesEnrroled -> 1 
 * timesEnrroled -> >=2
 * 
 * stars -> 1
 * stars -> 2
 * stars -> 3
 * 
 */

// Dynamic routes -> Vistas Data table para que el mae seleccione el curso, otra vista con dos botones 
//next appointment y assign appointment 


async function getAppointmentsListByPriority(Student, professorCourseId, courseId) {
    if (Student.enrollment_count === 0) {
      if (Student.stars_rating === 1) {
        // Retorna citas no reservadas para el curso en el que está inscrito el estudiante
        return await getAppointmentsNotReservedByProfessorCourse(professorCourseId);
      } else if (Student.stars_rating === 2) {
        // Une las citas no reservadas de la semana actual y la próxima para el curso en el que está inscrito el estudiante
        // FALTA VER EL PUNTO 2 EN LA PRIORIDAD
        const appointmentsCurrentWeek = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
        const appointmentsNextWeek = await getAppointmentsNotReservedNextWeekByProfessorCourse(professorCourseId);
        return appointmentsCurrentWeek.concat(appointmentsNextWeek);
      } else {
        // Une las citas de la semana actual y todas las citas disponibles para el curso en el que está inscrito el estudiante
        // FALTA VER EL PUNTO 2 EN LA PRIORIDAD
        const appointmentsCurrentWeek = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
        const appointmentsAvailable = await getAppointmentsAvailableByProfessorCourse(professorCourseId);
        return appointmentsCurrentWeek.concat(appointmentsAvailable);
      }
    }
    
  }
  
