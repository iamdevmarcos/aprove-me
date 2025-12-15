import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Clearing database...');

    await prisma.payable.deleteMany({});
    console.log('Payables table cleared');

    await prisma.assignor.deleteMany({});
    console.log('Assignors table cleared');

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
