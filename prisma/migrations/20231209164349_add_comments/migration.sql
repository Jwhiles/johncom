/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Test";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "responseToId" TEXT,
    CONSTRAINT "Comment_responseToId_fkey" FOREIGN KEY ("responseToId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
