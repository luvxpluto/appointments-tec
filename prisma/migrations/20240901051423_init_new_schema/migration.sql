-- CreateTable
CREATE TABLE "Student" (
    "id_student" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id_student")
);

-- CreateTable
CREATE TABLE "Course" (
    "id_course" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id_course")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id_professor" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id_professor")
);

-- CreateTable
CREATE TABLE "ProfessorCourse" (
    "id_professor_course" SERIAL NOT NULL,
    "id_professor" TEXT NOT NULL,
    "id_course" TEXT NOT NULL,

    CONSTRAINT "ProfessorCourse_pkey" PRIMARY KEY ("id_professor_course")
);

-- CreateTable
CREATE TABLE "StudentCourse" (
    "id_student_course" SERIAL NOT NULL,
    "id_student" TEXT NOT NULL,
    "id_professor_course" INTEGER NOT NULL,
    "enrollment_count" INTEGER NOT NULL,
    "stars_rating" INTEGER NOT NULL,

    CONSTRAINT "StudentCourse_pkey" PRIMARY KEY ("id_student_course")
);

-- CreateTable
CREATE TABLE "AppointmentSchedule" (
    "id_appointment_schedule" SERIAL NOT NULL,
    "id_professor_course" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "number_appointments" INTEGER NOT NULL,
    "number_appointments_reserve" INTEGER NOT NULL,
    "duration_appointment" INTEGER NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "id_semester" INTEGER NOT NULL,

    CONSTRAINT "AppointmentSchedule_pkey" PRIMARY KEY ("id_appointment_schedule")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id_appointment" SERIAL NOT NULL,
    "id_appointment_schedule" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "id_student" TEXT,
    "is_reserved" BOOLEAN NOT NULL,
    "is_available" BOOLEAN NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id_appointment")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id_semester" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id_semester")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorCourse_id_professor_id_course_key" ON "ProfessorCourse"("id_professor", "id_course");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCourse_id_student_id_professor_course_key" ON "StudentCourse"("id_student", "id_professor_course");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSchedule_id_professor_course_day_of_week_key" ON "AppointmentSchedule"("id_professor_course", "day_of_week");

-- AddForeignKey
ALTER TABLE "ProfessorCourse" ADD CONSTRAINT "ProfessorCourse_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "Professor"("id_professor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorCourse" ADD CONSTRAINT "ProfessorCourse_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "Student"("id_student") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_id_professor_course_fkey" FOREIGN KEY ("id_professor_course") REFERENCES "ProfessorCourse"("id_professor_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentSchedule" ADD CONSTRAINT "AppointmentSchedule_id_professor_course_fkey" FOREIGN KEY ("id_professor_course") REFERENCES "ProfessorCourse"("id_professor_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentSchedule" ADD CONSTRAINT "AppointmentSchedule_id_semester_fkey" FOREIGN KEY ("id_semester") REFERENCES "Semester"("id_semester") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_id_appointment_schedule_fkey" FOREIGN KEY ("id_appointment_schedule") REFERENCES "AppointmentSchedule"("id_appointment_schedule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "Student"("id_student") ON DELETE SET NULL ON UPDATE CASCADE;
