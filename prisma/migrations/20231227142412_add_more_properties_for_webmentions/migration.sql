/*
  Warnings:

  - Added the required column `authorUrl` to the `Webmention` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wmProperty` to the `Webmention` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Webmention" (
    "target" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "authorName" TEXT,
    "authorPhoto" TEXT,
    "authorUrl" TEXT NOT NULL,
    "wmProperty" TEXT NOT NULL,
    "contentText" TEXT,
    "raw" TEXT NOT NULL,

    PRIMARY KEY ("target", "source")
);
INSERT INTO "new_Webmention" ("raw", "source", "target", "authorUrl", "wmProperty") SELECT "raw", "source", "target", "https://johnwhiles.com", "mention-of" FROM "Webmention";
DROP TABLE "Webmention";
ALTER TABLE "new_Webmention" RENAME TO "Webmention";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
