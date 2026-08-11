-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'nysc', 'unknown');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('onsite', 'remote', 'hybrid', 'unknown');

-- CreateEnum
CREATE TYPE "SourceName" AS ENUM ('jobberman', 'myjobmag', 'ngcareers', 'hotnigerianjobs', 'greenhouse', 'lever', 'whatsapp_manual');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "sourceName" "SourceName" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "applyUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'unknown',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'unknown',
    "category" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT DEFAULT 'NGN',
    "description" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_hash_key" ON "Job"("hash");

-- CreateIndex
CREATE INDEX "Job_state_workMode_employmentType_idx" ON "Job"("state", "workMode", "employmentType");

-- CreateIndex
CREATE INDEX "Job_category_idx" ON "Job"("category");

-- CreateIndex
CREATE INDEX "Job_firstSeenAt_idx" ON "Job"("firstSeenAt");

-- CreateIndex
CREATE INDEX "Job_expiredAt_idx" ON "Job"("expiredAt");
