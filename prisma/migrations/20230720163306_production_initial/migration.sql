-- CreateEnum
CREATE TYPE "PaidStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "seller" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ItemList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemListId" TEXT NOT NULL,

    CONSTRAINT "ItemName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemNameId" TEXT NOT NULL,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemLength" (
    "id" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "ItemLength_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paidStatus" "PaidStatus" NOT NULL,
    "date" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "totalProfit" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "InvoiceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Profit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfitItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "totalProfit" INTEGER NOT NULL,
    "profitId" TEXT NOT NULL,

    CONSTRAINT "ProfitItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ItemList_userId_key" ON "ItemList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemName_name_itemListId_key" ON "ItemName"("name", "itemListId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemType_type_itemNameId_key" ON "ItemType"("type", "itemNameId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemLength_length_itemTypeId_cost_key" ON "ItemLength"("length", "itemTypeId", "cost");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_id_userId_key" ON "Invoice"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_invoiceId_userId_id_key" ON "InvoiceItem"("invoiceId", "userId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Profit_userId_date_key" ON "Profit"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ProfitItem_profitId_name_type_key" ON "ProfitItem"("profitId", "name", "type");

-- AddForeignKey
ALTER TABLE "ItemName" ADD CONSTRAINT "ItemName_itemListId_fkey" FOREIGN KEY ("itemListId") REFERENCES "ItemList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_itemNameId_fkey" FOREIGN KEY ("itemNameId") REFERENCES "ItemName"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemLength" ADD CONSTRAINT "ItemLength_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitItem" ADD CONSTRAINT "ProfitItem_profitId_fkey" FOREIGN KEY ("profitId") REFERENCES "Profit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
