-- AlterEnum
ALTER TYPE "AdminNotificationType" ADD VALUE IF NOT EXISTS 'PRIVACY_REQUEST_CREATED';

-- CreateEnum
CREATE TYPE "DataPrivacyRequestType" AS ENUM (
    'ACCESS',
    'RECTIFICATION',
    'ERASURE',
    'PORTABILITY',
    'OBJECTION',
    'WITHDRAW_CONSENT'
);

-- CreateEnum
CREATE TYPE "DataPrivacyRequestStatus" AS ENUM (
    'RECEIVED',
    'IDENTITY_PENDING',
    'IN_REVIEW',
    'FULFILLED',
    'REJECTED'
);

-- CreateTable
CREATE TABLE "DataPrivacyRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "requestType" "DataPrivacyRequestType" NOT NULL,
    "message" TEXT,
    "status" "DataPrivacyRequestStatus" NOT NULL DEFAULT 'RECEIVED',
    "resolutionNotes" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPrivacyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_email_idx" ON "DataPrivacyRequest"("email");

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_status_createdAt_idx" ON "DataPrivacyRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_processedById_idx" ON "DataPrivacyRequest"("processedById");

-- CreateIndex
CREATE INDEX "DataPrivacyRequest_createdAt_idx" ON "DataPrivacyRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "DataPrivacyRequest" ADD CONSTRAINT "DataPrivacyRequest_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
