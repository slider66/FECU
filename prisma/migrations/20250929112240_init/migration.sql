-- CreateTable
CREATE TABLE "public"."photos" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    "bucketPath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "photos_bucketPath_key" ON "public"."photos"("bucketPath");
