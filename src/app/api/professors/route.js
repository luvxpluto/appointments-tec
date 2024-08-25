import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function validateCreateProfessor(body) {
    if (!body || !body.name || body.name.trim() === "") {
        return { valid: false, error: "Professor name is required" };
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
        const existingProfessor = await prisma.professor.findMany({
            where: {
                name: body.name.trim(),
            },
        });
        if (existingProfessor.length > 0) {  // Cambié esto a existingProfessor.length > 0
            return NextResponse.json({ error: "Professor already exists" }, { status: 409 });
        }

        // Create the professor in the database
        const newProfessor = await prisma.professor.create({
            data: {
                name: body.name.trim(),
            },
        });

        return NextResponse.json(newProfessor, { status: 201 });
    } catch (error) {
        console.error("Error creating the professor:", error);
        return NextResponse.json(
            { error: "Error creating the professor" },
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
        console.error("Error getting the professors:", error);
        return NextResponse.json(
            { error: "Error getting the professors" },
            { status: 500 }
        );
    }
}
