-- CreateTable
CREATE TABLE "verfication" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verfication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verfication_email_key" ON "verfication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verfication_code_key" ON "verfication"("code");
