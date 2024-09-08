import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function convertDataTimeToISO(date_time) {
    try {
        // Convertir la fecha en formato GMT a un objeto Date
        const gmtDate = new Date(date_time);
        // Obtener el desfase horario local en minutos
        const localTimeZoneOffset = new Date().getTimezoneOffset();
        // Ajustar la fecha GMT al desfase horario local
        gmtDate.setMinutes(gmtDate.getMinutes() - localTimeZoneOffset);
        // Convertir la fecha ajustada a una cadena en formato ISO
        return gmtDate.toISOString();
    } catch (error) {
        console.error("Error al convertir date_time:", error.message);
        return null;
    }
}

export async function GET(request) {
    try {
        const schedules = await prisma.appointment.findMany();
        const convertedSchedules = schedules.map(schedule => {
            let convertedDateTime = convertDataTimeToISO(schedule.date_time);
            return {
                ...schedule,
                date_time: convertedDateTime,

            };
        });
        return NextResponse.json(convertedSchedules, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las citas:", error.message, error.stack);
        return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
    }
}