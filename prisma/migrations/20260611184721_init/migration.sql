-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "website" TEXT,
    "ownerName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "uei" TEXT,
    "cageCode" TEXT,
    "naicsCodes" TEXT,
    "certifications" TEXT,
    "setAsides" TEXT,
    "services" TEXT,
    "differentiators" TEXT,
    "pastPerformance" TEXT,
    "teamBios" TEXT,
    "serviceAreas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfpDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'paste',
    "textContent" TEXT NOT NULL,
    "textLength" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RfpDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfpAnalysis" (
    "id" TEXT NOT NULL,
    "rfpDocumentId" TEXT NOT NULL,
    "title" TEXT,
    "agency" TEXT,
    "solicitationNumber" TEXT,
    "deadline" TEXT,
    "naicsCodes" TEXT,
    "setAside" TEXT,
    "summary" TEXT,
    "submissionInstructions" TEXT,
    "evaluationCriteria" TEXT,
    "requiredDocuments" TEXT,
    "risks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfpAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfpRequirement" (
    "id" TEXT NOT NULL,
    "rfpDocumentId" TEXT NOT NULL,
    "reqId" TEXT NOT NULL,
    "section" TEXT,
    "pageReference" TEXT,
    "requirementText" TEXT NOT NULL,
    "responseNeeded" TEXT,
    "requiredDocument" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfpRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rfpDocumentId" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalSection" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedTool" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "toolType" TEXT NOT NULL,
    "input" TEXT,
    "output" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "meta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedOpportunity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "agency" TEXT,
    "solicitationNumber" TEXT,
    "url" TEXT,
    "deadline" TEXT,
    "naicsCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "CompanyProfile"("userId");

-- CreateIndex
CREATE INDEX "RfpDocument_userId_createdAt_idx" ON "RfpDocument"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RfpAnalysis_rfpDocumentId_key" ON "RfpAnalysis"("rfpDocumentId");

-- CreateIndex
CREATE INDEX "RfpRequirement_rfpDocumentId_sortOrder_idx" ON "RfpRequirement"("rfpDocumentId", "sortOrder");

-- CreateIndex
CREATE INDEX "Proposal_userId_createdAt_idx" ON "Proposal"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ProposalSection_proposalId_sortOrder_idx" ON "ProposalSection"("proposalId", "sortOrder");

-- CreateIndex
CREATE INDEX "GeneratedTool_userId_toolType_createdAt_idx" ON "GeneratedTool"("userId", "toolType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "UsageLog_userId_action_createdAt_idx" ON "UsageLog"("userId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "SavedOpportunity_userId_createdAt_idx" ON "SavedOpportunity"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfpDocument" ADD CONSTRAINT "RfpDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfpAnalysis" ADD CONSTRAINT "RfpAnalysis_rfpDocumentId_fkey" FOREIGN KEY ("rfpDocumentId") REFERENCES "RfpDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfpRequirement" ADD CONSTRAINT "RfpRequirement_rfpDocumentId_fkey" FOREIGN KEY ("rfpDocumentId") REFERENCES "RfpDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_rfpDocumentId_fkey" FOREIGN KEY ("rfpDocumentId") REFERENCES "RfpDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalSection" ADD CONSTRAINT "ProposalSection_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedTool" ADD CONSTRAINT "GeneratedTool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOpportunity" ADD CONSTRAINT "SavedOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
