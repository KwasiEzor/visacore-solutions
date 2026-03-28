-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'APPLICANT';

-- CreateEnum
CREATE TYPE "ProcedureStatus" AS ENUM (
  'INTAKE',
  'DOCUMENTS_PENDING',
  'IN_REVIEW',
  'SUBMITTED',
  'INTERVIEW_SCHEDULED',
  'DECISION_PENDING',
  'APPROVED',
  'REFUSED',
  'COMPLETED',
  'ON_HOLD'
);

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "ChecklistItemStatus" AS ENUM (
  'PENDING',
  'REQUESTED',
  'UPLOADED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'NEEDS_REVISION',
  'WAIVED'
);

-- CreateEnum
CREATE TYPE "ApplicantDocumentStatus" AS ENUM (
  'UPLOADED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'NEEDS_REVISION',
  'ARCHIVED'
);

-- CreateTable
CREATE TABLE "ApplicantProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "phone" TEXT,
  "whatsappNumber" TEXT,
  "countryOfResidence" TEXT,
  "nationality" TEXT,
  "passportNumber" TEXT,
  "dateOfBirth" TIMESTAMP(3),
  "addressLine" TEXT,
  "city" TEXT,
  "postalCode" TEXT,
  "preferredDestination" TEXT,
  "targetService" TEXT,
  "currentSituation" TEXT,
  "emergencyContactName" TEXT,
  "emergencyContactPhone" TEXT,
  "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApplicantProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantCase" (
  "id" TEXT NOT NULL,
  "applicantId" TEXT NOT NULL,
  "advisorId" TEXT,
  "reference" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "serviceName" TEXT,
  "destinationCountry" TEXT NOT NULL,
  "visaCategory" TEXT NOT NULL,
  "status" "ProcedureStatus" NOT NULL DEFAULT 'INTAKE',
  "summary" TEXT,
  "currentStep" TEXT,
  "nextActionTitle" TEXT,
  "nextActionDescription" TEXT,
  "nextActionDueAt" TIMESTAMP(3),
  "lastSharedUpdateAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApplicantCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantCaseMilestone" (
  "id" TEXT NOT NULL,
  "caseId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
  "occurredAt" TIMESTAMP(3),
  "visibleToApplicant" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApplicantCaseMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantChecklistItem" (
  "id" TEXT NOT NULL,
  "caseId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "status" "ChecklistItemStatus" NOT NULL DEFAULT 'PENDING',
  "dueDate" TIMESTAMP(3),
  "visibleToApplicant" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApplicantChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantDocument" (
  "id" TEXT NOT NULL,
  "caseId" TEXT NOT NULL,
  "applicantId" TEXT NOT NULL,
  "checklistItemId" TEXT,
  "label" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "storagePath" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "uploadedByApplicant" BOOLEAN NOT NULL DEFAULT true,
  "status" "ApplicantDocumentStatus" NOT NULL DEFAULT 'UPLOADED',
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApplicantDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantProfile_userId_key" ON "ApplicantProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantCase_reference_key" ON "ApplicantCase"("reference");

-- CreateIndex
CREATE INDEX "ApplicantCase_applicantId_updatedAt_idx" ON "ApplicantCase"("applicantId", "updatedAt");

-- CreateIndex
CREATE INDEX "ApplicantCase_advisorId_status_idx" ON "ApplicantCase"("advisorId", "status");

-- CreateIndex
CREATE INDEX "ApplicantCase_status_updatedAt_idx" ON "ApplicantCase"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "ApplicantCaseMilestone_caseId_visibleToApplicant_occurredAt_idx" ON "ApplicantCaseMilestone"("caseId", "visibleToApplicant", "occurredAt");

-- CreateIndex
CREATE INDEX "ApplicantCaseMilestone_status_createdAt_idx" ON "ApplicantCaseMilestone"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicantChecklistItem_caseId_status_sortOrder_idx" ON "ApplicantChecklistItem"("caseId", "status", "sortOrder");

-- CreateIndex
CREATE INDEX "ApplicantChecklistItem_dueDate_idx" ON "ApplicantChecklistItem"("dueDate");

-- CreateIndex
CREATE INDEX "ApplicantDocument_caseId_status_createdAt_idx" ON "ApplicantDocument"("caseId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicantDocument_applicantId_createdAt_idx" ON "ApplicantDocument"("applicantId", "createdAt");

-- CreateIndex
CREATE INDEX "ApplicantDocument_checklistItemId_idx" ON "ApplicantDocument"("checklistItemId");

-- AddForeignKey
ALTER TABLE "ApplicantProfile"
ADD CONSTRAINT "ApplicantProfile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantCase"
ADD CONSTRAINT "ApplicantCase_applicantId_fkey"
FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantCase"
ADD CONSTRAINT "ApplicantCase_advisorId_fkey"
FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantCaseMilestone"
ADD CONSTRAINT "ApplicantCaseMilestone_caseId_fkey"
FOREIGN KEY ("caseId") REFERENCES "ApplicantCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantChecklistItem"
ADD CONSTRAINT "ApplicantChecklistItem_caseId_fkey"
FOREIGN KEY ("caseId") REFERENCES "ApplicantCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantDocument"
ADD CONSTRAINT "ApplicantDocument_caseId_fkey"
FOREIGN KEY ("caseId") REFERENCES "ApplicantCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantDocument"
ADD CONSTRAINT "ApplicantDocument_applicantId_fkey"
FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantDocument"
ADD CONSTRAINT "ApplicantDocument_checklistItemId_fkey"
FOREIGN KEY ("checklistItemId") REFERENCES "ApplicantChecklistItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
