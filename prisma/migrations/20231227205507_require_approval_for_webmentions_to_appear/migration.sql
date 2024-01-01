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
    "approved" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("target", "source")
);
INSERT INTO "new_Webmention" ("authorName", "authorPhoto", "authorUrl", "contentText", "raw", "source", "target", "wmProperty") SELECT "authorName", "authorPhoto", "authorUrl", "contentText", "raw", "source", "target", "wmProperty" FROM "Webmention";
DROP TABLE "Webmention";
ALTER TABLE "new_Webmention" RENAME TO "Webmention";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
