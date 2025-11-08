import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create sample customers
  const customers = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1-555-0101",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+1-555-0102",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
    },
    {
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@example.com",
      phoneNumber: "+1-555-0103",
      address: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      country: "USA",
    },
    {
      firstName: "Alice",
      lastName: "Williams",
      email: "alice.williams@example.com",
      phoneNumber: null,
      address: null,
      city: "Houston",
      state: "TX",
      country: "USA",
    },
    {
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie.brown@example.com",
      phoneNumber: "+1-555-0105",
      address: "321 Elm St",
      city: "Phoenix",
      state: "AZ",
      country: "USA",
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: customer,
    });
    console.log(`✅ Created/Updated customer: ${customer.email}`);
  }

  console.log("✨ Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
