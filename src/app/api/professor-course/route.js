import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function validateAsignCourse(body) {
    if (!body || !body.id_course || !body.id_course.trim() === "" || !body.id_professor || !body.id_professor.trim() === "") {
        return { valid: false, error: "Course ID and Professor ID are required" };
    }
    return { valid: true };
}