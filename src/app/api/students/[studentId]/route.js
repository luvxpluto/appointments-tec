import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { studentId } = params;

    try {
        const student = await prisma.student.findUnique({
            where: {
                id_student: studentId.toString().trim(),
            }
        });
        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las citas:", error.message, error.stack);
        return NextResponse.json({ error: "Error al obtener las citas" }, { status: 500 });
    }
}
