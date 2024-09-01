import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSemester } from "@/app/api/semester/route";

function validateSchedule(body){
    if (
        !body || 
        !body.id_professor_course || body.id_professor_course.trim() === "" || 
        !body.start_time || body.start_time.trim() === "" || 
        !body.end_time || body.end_time.trim() === "" ||
        !body.number_appointments || body.number_appointments.toString().trim() === "" ||
        !body.number_appointment_reserve || body.number_appointment_reserve.toString().trim() === "" ||
        !body.day || body.day.trim() === ""
    ) {
        return { valid: false, error: "Todos los campos requeridos deben estar completos y válidos" };
    }
    return { valid: true };
}

function getNextDayOfWeek(date, dayOfWeek){
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
}

function getDatesForDayOfWeek(startDate, endDate, dayOfWeek){
    const dates = [];
    let currentDate = getNextDayOfWeek(new Date(startDate), dayOfWeek);
    const endDateTime = new Date(endDate).getTime();

    while (currentDate.getTime() <= endDateTime) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
    }
    return dates;
}

function parseTimeString(timeString){
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

function calculateAppointmentDuration(startTime, endTime, numberOfAppointments){
    const start = new Date(2000, 0, 1, startTime.hours, startTime.minutes);
    const end = new Date(2000, 0, 1, endTime.hours, endTime.minutes);
    const totalMinutes = (end - start) / 60000; // Diferencia en minutos
    return Math.floor(totalMinutes / numberOfAppointments);
}

function createDateWithTime(date, time){
    const newDate = new Date(date);
    newDate.setHours(time.hours, time.minutes, 0, 0);
    return newDate;
}

async function getSchedule(body, currentSemester){
    const existingSchedule = await prisma.appointmentSchedule.findFirst({
        where: {
            id_professor_course: parseInt(body.id_professor_course),
            day_of_week: body.day.trim(),
            id_semester: currentSemester.id_semester,
        },
    });
    return existingSchedule;
}

async function createSchedule(body, currentSemester, startTime, endTime, duration_appointment){
    const newSchedule = await prisma.appointmentSchedule.create({
        data: {
            id_professor_course: parseInt(body.id_professor_course.trim()),
            start_time: `${startTime.hours.toString().padStart(2, '0')}:${startTime.minutes.toString().padStart(2, '0')}`,
            end_time: `${endTime.hours.toString().padStart(2, '0')}:${endTime.minutes.toString().padStart(2, '0')}`,
            number_appointments: parseInt(body.number_appointments),
            number_appointments_reserve: parseInt(body.number_appointment_reserve),
            duration_appointment: duration_appointment,
            day_of_week: body.day.trim(),
            id_semester: currentSemester.id_semester,
        },
    });
    return newSchedule;
}

async function createAppointmentsData(currentSemester, newSchedule, body, startTime, duration_appointment){
    const dayOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(body.day.trim().toLowerCase());
    const semesterDates = getDatesForDayOfWeek(currentSemester.start_date, currentSemester.end_date, dayOfWeek);

    const appointments = [];
    semesterDates.forEach(date => {
        let currentAppointmentTime = createDateWithTime(date, startTime);

        for (let i = 0; i < parseInt(body.number_appointments); i++) {
            appointments.push({
                id_appointment_schedule: newSchedule.id_appointment_schedule,
                date_time: currentAppointmentTime.toISOString(),
                is_reserved: i < parseInt(body.number_appointment_reserve),
                is_available: true,
            });
            currentAppointmentTime.setMinutes(currentAppointmentTime.getMinutes() + duration_appointment);
        }
    });
    return appointments;
}

async function createAppointments(appointments){
    await prisma.appointment.createMany({ data: appointments });
}

export async function POST(request) {
    try {
        const body = await request.json();
        // Validate the request body
        const validation = validateSchedule(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }
        //Check if there's a current semester
        const currentSemester = await getCurrentSemester();
        if (!currentSemester) {
            return NextResponse.json({ error: "No hay un semestre activo actualmente" }, { status: 400 });
        }
        //Check if the schedule already exists -> Same day -> Can change if needed
        const existingSchedule = await getSchedule(body, currentSemester);
        if (existingSchedule) {
            return NextResponse.json({ error: "Ya existe un horario para este curso y día en el semestre actual" }, { status: 400 });
        }
        //Parse time strings to objects
        const startTime = parseTimeString(body.start_time.trim());
        const endTime = parseTimeString(body.end_time.trim());
        //Calculate duration of each appointment
        const duration_appointment = calculateAppointmentDuration(startTime,endTime, parseInt(body.number_appointments));

        try {
            //Create the schedule
            const newSchedule = await createSchedule(body, currentSemester, startTime, endTime, duration_appointment);
            //Create the appointments
            const appointments = await createAppointmentsData(currentSemester, newSchedule, body, startTime, duration_appointment);
            // Create the appointments in the database
            createAppointments(appointments);
        } catch (error) {
            return NextResponse.json({ error: "Error al crear las horas de consulta y las citas" }, { status: 500 });
        }
        return NextResponse.json(newSchedule, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear las horas de consulta y las citas" }, { status: 500 });
    }
}