-- CreateTable
CREATE TABLE "FooterWidget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "columnIndex" INTEGER NOT NULL,
    "title" TEXT,
    "type" TEXT NOT NULL DEFAULT 'links',
    "content" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FooterWidget_columnIndex_idx" ON "FooterWidget"("columnIndex");

-- CreateIndex
CREATE INDEX "FooterWidget_order_idx" ON "FooterWidget"("order");
