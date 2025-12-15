import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('aprovame', 10);

  const user = await prisma.user.upsert({
    where: { login: 'aprovame' },
    update: {},
    create: {
      login: 'aprovame',
      password: hashedPassword,
    },
  });

  console.log('Seeded user:', user.login);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
