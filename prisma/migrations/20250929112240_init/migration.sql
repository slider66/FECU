-- CreateEnum
CREATE TYPE "RepairStage" AS ENUM ('ENTRY', 'EXIT');

-- CreateTable
CREATE TABLE "public"."photos" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repairNumber" TEXT NOT NULL,
    "stage" "RepairStage" NOT NULL,
    "bucketPath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "technician" TEXT,
    "comments" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "photos_bucketPath_key" ON "public"."photos"("bucketPath");
