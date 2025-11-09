import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emma",
  "James",
  "Emily",
  "Robert",
  "Olivia",
  "William",
  "Ava",
  "Richard",
  "Sophia",
  "Joseph",
  "Isabella",
  "Thomas",
  "Mia",
  "Charles",
  "Charlotte",
  "Daniel",
  "Amelia",
  "Matthew",
  "Harper",
  "Anthony",
  "Evelyn",
  "Mark",
  "Abigail",
  "Donald",
  "Elizabeth",
  "Steven",
  "Sofia",
  "Paul",
  "Ella",
  "Andrew",
  "Madison",
  "Joshua",
  "Scarlett",
  "Kenneth",
  "Victoria",
  "Kevin",
  "Aria",
  "Brian",
  "Grace",
  "George",
  "Chloe",
  "Edward",
  "Camila",
  "Ronald",
  "Penelope",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Boston",
  "Nashville",
  "Detroit",
  "Portland",
  "Las Vegas",
  "Memphis",
  "Louisville",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Kansas City",
  "Atlanta",
  "Miami",
];

const states = [
  "NY",
  "CA",
  "IL",
  "TX",
  "AZ",
  "PA",
  "FL",
  "OH",
  "NC",
  "WA",
  "CO",
  "MA",
  "TN",
  "MI",
  "OR",
  "NV",
  "KY",
  "MD",
  "WI",
  "NM",
];

const countries = ["USA", "Canada", "Mexico", "UK", "Australia"];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const first3 = Math.floor(Math.random() * 900) + 100;
  const last4 = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${first3}-${last4}`;
}

function generateAddress(): string {
  const streetNumber = Math.floor(Math.random() * 9999) + 1;
  const streets = [
    "Main St",
    "Oak Ave",
    "Maple Dr",
    "Cedar Ln",
    "Pine St",
    "Elm St",
    "Park Ave",
  ];
  return `${streetNumber} ${getRandomElement(streets)}`;
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing customers
  console.log("🗑️  Clearing existing customers...");
  await prisma.customer.deleteMany({});

  console.log("👥 Creating 100 customers...");

  const customers = [];

  for (let i = 0; i < 100; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

    // Make some fields optional randomly
    const includePhone = Math.random() > 0.2; // 80% have phone
    const includeAddress = Math.random() > 0.3; // 70% have address

    customers.push({
      firstName,
      lastName,
      email,
      phoneNumber: includePhone ? generatePhoneNumber() : null,
      address: includeAddress ? generateAddress() : null,
      city: includeAddress ? getRandomElement(cities) : null,
      state: includeAddress ? getRandomElement(states) : null,
      country: includeAddress ? getRandomElement(countries) : null,
    });
  }

  // Create customers in batches for better performance
  const batchSize = 10;
  for (let i = 0; i < customers.length; i += batchSize) {
    const batch = customers.slice(i, i + batchSize);
    await prisma.customer.createMany({
      data: batch,
    });
    console.log(
      `✅ Created customers ${i + 1} - ${Math.min(
        i + batchSize,
        customers.length
      )}`
    );
  }

  const count = await prisma.customer.count();
  console.log(`\n🎉 Seed completed! Total customers in database: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
