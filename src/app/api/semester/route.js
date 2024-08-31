import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function validateSemester(body) {
    if (!body || !body.start_date || body.start_date.trim() === "" || !body.end_date || body.end_date.trim() === "") {
        return { valid: false, error: "La fecha de inicio y fin del semestre son requeridos" };
    }

    const startDate = new Date(body.start_date);
    const endDate = new Date(body.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { valid: false, error: "Las fechas de inicio y fin del semestre no son válidas" };
    }

    if (startDate >= endDate) {
        return { valid: false, error: "La fecha de inicio del semestre debe ser anterior a la fecha de fin" };
    }

    return { valid: true };
}

async function validateSemesterDate(body) {
    try {
        const existingSemesters = await prisma.semester.findMany();
        return existingSemesters.some(semester => {
            const startDate = new Date(semester.start_date);
            const endDate = new Date(semester.end_date);
            const newStartDate = new Date(body.start_date);
            return newStartDate >= startDate && newStartDate <= endDate;
        });
    } catch (error) {
        console.error("Error al validar las fechas del semestre:", error);
        throw new Error("Error en la validación de fechas");
    }
}

//POST method to create a semester
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validation = validateSemester(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const overlappingSemester = await validateSemesterDate(body);
        if (overlappingSemester) {
            return NextResponse.json({ error: "La fecha de inicio del semestre se superpone con otro semestre existente" }, { status: 400 });
        }

        // Create the semester
        const newSemester = await prisma.semester.create({
            data: {
                start_date: new Date(body.start_date.trim()).toISOString(),
                end_date: new Date(body.end_date.trim()).toISOString(),
            },
        });

        return NextResponse.json(newSemester, { status: 201 });
    } catch (error) {
        console.error("Error al crear el semestre:", error.message, error.stack);
        return NextResponse.json({ error: "Error al crear el semestre" }, { status: 500 });
    }
}

//Get semester of current date
export async function GET(request) {
    try {
        const currentDate = new Date();
        const currentSemester = await prisma.semester.findFirst({
            where: {
                start_date: {
                    lte: currentDate.toISOString(),
                },
                end_date: {
                    gte: currentDate.toISOString(),
                },
            },
            select:{
                id_semester: true
            }
        });

        return NextResponse.json(currentSemester, { status: 200 });
    } catch (error) {
        console.error("Error al obtener el semestre actual:", error);
        return NextResponse.json({ error: "Error al obtener el semestre actual" }, { status: 500 });
    }
}