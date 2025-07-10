/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Summary_title_key" ON "Summary"("title");
