/*
  Warnings:

  - You are about to drop the column `id_course` on the `StudentCourse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_student,id_professor_course]` on the table `StudentCourse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_professor_course` to the `StudentCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentCourse" DROP CONSTRAINT "StudentCourse_id_course_fkey";

-- DropIndex
DROP INDEX "StudentCourse_id_student_id_course_key";

-- AlterTable
ALTER TABLE "StudentCourse" DROP COLUMN "id_course",
ADD COLUMN     "id_professor_course" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentCourse_id_student_id_professor_course_key" ON "StudentCourse"("id_student", "id_professor_course");

-- AddForeignKey
ALTER TABLE "StudentCourse" ADD CONSTRAINT "StudentCourse_id_professor_course_fkey" FOREIGN KEY ("id_professor_course") REFERENCES "ProfessorCourse"("id_professor_course") ON DELETE RESTRICT ON UPDATE CASCADE;
