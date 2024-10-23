/*
  Warnings:

  - A unique constraint covering the columns `[userId,linkProviderId,order]` on the table `UserLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLink_userId_linkProviderId_order_key" ON "UserLink"("userId", "linkProviderId", "order");
