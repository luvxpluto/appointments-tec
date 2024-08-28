import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function validateCreateProfessor(body) {
    if (!body || !body.name || body.name.trim() === "" || !body.id_professor || body.id_professor.toString().trim() === "") {
        return { valid: false, error: "El id y nombre del profesor son requeridos" };
    }
    return { valid: true };
}

//POST method to create a professor
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validation = validateCreateProfessor(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Check if the professor already exists
        const existingProfessor = await prisma.professor.findUnique({
            where: {
                id_professor: body.id_professor.toString().trim(),
            },
        });
        if (existingProfessor) {
            return NextResponse.json({ error: "El profesor ya existe" }, { status: 409 });
        }

        // Create the professor in the database
        const newProfessor = await prisma.professor.create({
            data: {
                id_professor: body.id_professor.toString().trim(),
                name: body.name.trim(),
            },
        });

        return NextResponse.json(newProfessor, { status: 201 });
    } catch (error) {
        console.error("Error al crear el profesor:", error);
        return NextResponse.json(
            { error: "Error al crear el profesor" },
            { status: 500 }
        );
    }
}

//GET method to get all professors
export async function GET(request) {
    try {
        const professors = await prisma.professor.findMany();
        return NextResponse.json(professors, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los profesores:", error);
        return NextResponse.json(
            { error: "Error al obtener los profesores" },
            { status: 500 }
        );
    }
}
