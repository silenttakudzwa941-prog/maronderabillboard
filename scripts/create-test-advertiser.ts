import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const advertiser = await prisma.advertiser.upsert({
    where: {
      email: "test@maronderabillboard.com",
    },
    update: {},
    create: {
      id: "test-advertiser-001",
      businessName: "Test Business",
      email: "test@maronderabillboard.com",
      phone: "0770000000",
    },
  });

  console.log("Test advertiser created/found:");
  console.log(advertiser);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });