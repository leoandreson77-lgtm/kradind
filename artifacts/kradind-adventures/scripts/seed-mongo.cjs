const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority';

const storePath = path.resolve(__dirname, '..', 'data', 'cms-store.json');

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('flight_search');
    console.log('Connected to MongoDB database:', db.databaseName);

    if (fs.existsSync(storePath)) {
      const data = JSON.parse(fs.readFileSync(storePath, 'utf8'));

      if (data.treks && data.treks.length > 0) {
        const col = db.collection('kradind_treks');
        await col.deleteMany({});
        await col.insertMany(data.treks);
        console.log('Seeded treks:', data.treks.length);
      }

      if (data.bookings && data.bookings.length > 0) {
        const col = db.collection('kradind_bookings');
        await col.deleteMany({});
        await col.insertMany(data.bookings);
        console.log('Seeded bookings:', data.bookings.length);
      }

      if (data.leads && data.leads.length > 0) {
        const col = db.collection('kradind_leads');
        await col.deleteMany({});
        await col.insertMany(data.leads);
        console.log('Seeded leads:', data.leads.length);
      }

      if (data.homeSections) {
        const col = db.collection('kradind_config');
        await col.updateOne(
          { configKey: 'homeSections' },
          { $set: { configKey: 'homeSections', ...data.homeSections } },
          { upsert: true },
        );
        console.log('Seeded homeSections');
      }

      console.log('MongoDB Initialization Complete!');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
