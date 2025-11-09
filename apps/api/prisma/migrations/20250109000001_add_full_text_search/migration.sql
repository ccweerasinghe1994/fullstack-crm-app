-- AlterTable
ALTER TABLE "customers" ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(first_name, '') || ' ' || 
    coalesce(last_name, '') || ' ' || 
    coalesce(email, '') || ' ' || 
    coalesce(phone_number, '') || ' ' || 
    coalesce(address, '') || ' ' || 
    coalesce(city, '') || ' ' || 
    coalesce(state, '') || ' ' || 
    coalesce(country, '')
  )
) STORED;

-- CreateIndex
CREATE INDEX "customers_search_vector_idx" ON "customers" USING GIN ("search_vector");

