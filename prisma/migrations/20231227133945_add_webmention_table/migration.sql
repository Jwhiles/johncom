-- CreateTable
CREATE TABLE "Webmention" (
    "target" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "raw" TEXT NOT NULL,

    PRIMARY KEY ("target", "source")
);
