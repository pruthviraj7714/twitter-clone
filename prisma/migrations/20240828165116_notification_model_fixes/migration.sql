-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "likerId" INTEGER,
ADD COLUMN     "replierId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_replierId_fkey" FOREIGN KEY ("replierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
