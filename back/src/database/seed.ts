import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedInitialData } from './seeds/initial-data.seed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('Starting database seeding...');
    await seedInitialData();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seed(); 