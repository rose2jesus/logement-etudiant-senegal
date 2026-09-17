-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('wave', 'orange_money');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateTable
CREATE TABLE "payment_orders" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "provider_reference" TEXT,
    "promotion_days" INTEGER NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_orders_provider_reference_key" ON "payment_orders"("provider_reference");

-- CreateIndex
CREATE INDEX "payment_orders_owner_id_status_idx" ON "payment_orders"("owner_id", "status");

-- CreateIndex
CREATE INDEX "payment_orders_property_id_status_idx" ON "payment_orders"("property_id", "status");

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
