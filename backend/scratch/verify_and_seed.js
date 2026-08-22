const prisma = require('../src/config/db');

async function main() {
  console.log('--- Verifying Schema & Seeding Cities ---');
  
  const citiesData = [
    { name: 'Paris', country: 'France', costIndex: 85.5, popularity: 98, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
    { name: 'Tokyo', country: 'Japan', costIndex: 82.0, popularity: 97, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
    { name: 'New York', country: 'United States', costIndex: 95.0, popularity: 99, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
    { name: 'Rome', country: 'Italy', costIndex: 75.0, popularity: 94, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
    { name: 'Barcelona', country: 'Spain', costIndex: 70.0, popularity: 92, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800' },
  ];

  for (const c of citiesData) {
    const existing = await prisma.city.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.city.create({ data: c });
      console.log(`+ Seeded city: ${c.name}`);
    }
  }

  const cityCount = await prisma.city.count();
  console.log(`Total cities in database: ${cityCount}`);
  console.log('✅ Verification and seeding complete!');
}

main()
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
