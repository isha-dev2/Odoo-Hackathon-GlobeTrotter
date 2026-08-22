const prisma = require('../src/config/db');

const citiesData = [
  {
    name: 'Paris',
    country: 'France',
    costIndex: 85.5,
    popularity: 98,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    costIndex: 82.0,
    popularity: 97,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  },
  {
    name: 'New York',
    country: 'United States',
    costIndex: 95.0,
    popularity: 99,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
  },
  {
    name: 'Rome',
    country: 'Italy',
    costIndex: 75.0,
    popularity: 94,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    costIndex: 70.0,
    popularity: 92,
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    costIndex: 90.0,
    popularity: 96,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    costIndex: 88.0,
    popularity: 91,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    costIndex: 45.0,
    popularity: 95,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    costIndex: 84.0,
    popularity: 89,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    costIndex: 79.0,
    popularity: 90,
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800',
  },
  {
    name: 'Prague',
    country: 'Czech Republic',
    costIndex: 55.0,
    popularity: 88,
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    costIndex: 40.0,
    popularity: 93,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  for (const city of citiesData) {
    const existing = await prisma.city.findFirst({
      where: { name: city.name, country: city.country },
    });

    if (!existing) {
      await prisma.city.create({ data: city });
      console.log(`Created city: ${city.name}, ${city.country}`);
    }
  }

  console.log('✅ Seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
