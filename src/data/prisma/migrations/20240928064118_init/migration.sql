-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profilePicturePath" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LinkProvider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "iconName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "allowedDomains" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserLink" (
    "userId" INTEGER NOT NULL,
    "linkProviderId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "link" TEXT NOT NULL,

    PRIMARY KEY ("userId", "linkProviderId"),
    CONSTRAINT "UserLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserLink_linkProviderId_fkey" FOREIGN KEY ("linkProviderId") REFERENCES "LinkProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
