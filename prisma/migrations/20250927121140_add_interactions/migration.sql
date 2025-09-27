-- CreateTable
CREATE TABLE "public"."interactions" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "place_name" TEXT,
    "interaction_time" TIMESTAMP(3),
    "notes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."interactions" ADD CONSTRAINT "interactions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
