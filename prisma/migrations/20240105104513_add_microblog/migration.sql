-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "inReplyToTitle" TEXT,
    "inReplyToUrl" TEXT,
    "inReplyToAuthor" TEXT,
    "content" TEXT NOT NULL,
    CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
