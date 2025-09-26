-- CreateTable
CREATE TABLE "public"."persons" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(55) NOT NULL,
    "name" VARCHAR(55) NOT NULL,
    "how_you_met" TEXT,
    "relationship_type" TEXT NOT NULL,
    "relationship_strength" INTEGER NOT NULL,
    "occupation" TEXT,
    "context" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);
