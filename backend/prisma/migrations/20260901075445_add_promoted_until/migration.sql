-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "promoted_until" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "properties_promoted_until_idx" ON "properties"("promoted_until");
