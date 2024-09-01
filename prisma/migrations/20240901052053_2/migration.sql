/*
  Warnings:

  - You are about to drop the column `day` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Appointment` table. All the data in the column will be lost.
  - Changed the type of `date` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "day",
DROP COLUMN "start_time",
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
