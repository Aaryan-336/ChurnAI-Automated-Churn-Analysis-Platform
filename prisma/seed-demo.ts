import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demoUserId = 'demo-user-id';
  
  // Upsert Demo User
  await prisma.user.upsert({
    where: { id: demoUserId },
    update: {},
    create: {
      id: demoUserId,
      email: 'demo@churnai.io',
      password: 'demo-password-hash',
      name: 'Demo Analyst',
    },
  });

  // Upsert Demo Project
  await prisma.project.upsert({
    where: { id: 'demo-project-id' },
    update: {},
    create: {
      id: 'demo-project-id',
      name: 'Acme SaaS Retention',
      description: 'Analyzing high-value churn signals for the Q1 period.',
      userId: demoUserId,
    },
  });

  console.log('✅ Demo data seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
