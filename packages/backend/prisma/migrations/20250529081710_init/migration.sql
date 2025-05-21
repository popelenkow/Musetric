-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sound" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" BLOB NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    CONSTRAINT "Sound_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Preview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "data" BLOB NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    CONSTRAINT "Preview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Sound_projectId_type_idx" ON "Sound"("projectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Preview_projectId_key" ON "Preview"("projectId");
