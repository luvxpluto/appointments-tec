import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//POST method to create a professor
export async function POST(request) {
    try {
        const body = await request.json();
        const { name } = body;

        // Basic validations - Check if the professor name is provided
        if (!name) {
            return NextResponse.json(
                { error: "Professor name is required" },
                { status: 400 }
            );
        }

        const newProfessor = await prisma.professor.create({
            data: {
                name,
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
