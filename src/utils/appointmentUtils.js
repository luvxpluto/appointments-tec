import {
    getAppointmentsNotReservedByProfessorCourse,
    getAppointmentsNotReservedCurrentWeekByProfessorCourse,
    getAppointmentsReservedCurrentWeekByProfessorCourse,
    getAppointmentsNotReservedNextWeekByProfessorCourse,
    getAppointmentsAvailableByProfessorCourse,
    getAppointmentsReservedNextWeekByProfessorCourse
} from "@/utils/prismaAppointmentUtils";


async function getAppointmentsListByPriority(Student, professorCourseId) {
    console.log(Student.enrollment_count);
    if (Student.enrollment_count === 0) {
      if (Student.stars_rating === 1) {
        const priority1 = await getAppointmentsNotReservedByProfessorCourse(professorCourseId);
        return priority1;
      } else if (Student.stars_rating === 2) {
        const priority1 = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
        //FALTA prioridad 2
        const priority3 = await getAppointmentsNotReservedNextWeekByProfessorCourse(professorCourseId);
        return priority1.concat(priority3);
      } else {
        const priority1 = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
        //FALTA prioridad 2
        const priority3 = await getAppointmentsAvailableByProfessorCourse(professorCourseId);
        return priority1.concat(priority3);
      }
    }

    if(Student.enrollment_count === 1) {
      if (Student.stars_rating === 1) {
        const priority1 = await getAppointmentsNotReservedByProfessorCourse(professorCourseId);
        return priority1;

      } else if (Student.stars_rating === 2) {
        //FALTA prioridad 1
        const priority2 = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
        //FALTA priotidad 3
        const priority4 = await getAppointmentsAvailableByProfessorCourse(professorCourseId);
        return priority2.concat(priority4);

      } else {
        const priority1 =  await getAppointmentsReservedCurrentWeekByProfessorCourse(professorCourseId);
        const priority2 = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
        //FALTA prioridad 3
        const priority4 = await getAppointmentsAvailableByProfessorCourse(professorCourseId);
        const priority5 = await getAppointmentsNotReservedNextWeekByProfessorCourse(professorCourseId);
        return priority1.concat(priority2, priority4, priority5);
      }
    } else {
        if (Student.stars_rating === 1) {
            const priority1 = await getAppointmentsNotReservedByProfessorCourse(professorCourseId);
            return priority1;
    
        } else if (Student.stars_rating === 2) {
            //FALTA prioridad 1
            const priority2 = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
            //FALTA priotidad 3
            //FALTA prioridad 4
            const priority5 = await getAppointmentsNotReservedByProfessorCourse(professorCourseId);
            return priority2.concat(priority5);
    
        } else {
            const priority1 =  await getAppointmentsReservedCurrentWeekByProfessorCourse(professorCourseId);
            const priority2 = await getAppointmentsNotReservedCurrentWeekByProfessorCourse(professorCourseId);
            //FALTA prioridad 3
            //FALTA prioridad 4
            const priority5 = await getAppointmentsReservedNextWeekByProfessorCourse(professorCourseId);
            const priority6 = await getAppointmentsNotReservedNextWeekByProfessorCourse(professorCourseId);
            return priority1.concat(priority2, priority5, priority6);
        }
    }
}
  

export default getAppointmentsListByPriority;