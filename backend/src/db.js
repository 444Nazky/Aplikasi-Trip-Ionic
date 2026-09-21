const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = new Database(':memory:');

function initialize() {
  // Regions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Officers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS officers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      pin TEXT NOT NULL,
      region_id TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (region_id) REFERENCES regions(id)
    )
  `);

  // Tariffs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tariffs (
      id TEXT PRIMARY KEY,
      golongan TEXT NOT NULL,
      vehicle_type TEXT NOT NULL,
      loaded_tariff INTEGER DEFAULT 0,
      empty_tariff INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Vehicles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      no_polisi TEXT NOT NULL,
      vehicle_type TEXT NOT NULL,
      golongan TEXT NOT NULL,
      trip_id TEXT,
      has_load INTEGER DEFAULT 0,
      tariff_id TEXT,
      tariff_amount INTEGER DEFAULT 0,
      foto_path TEXT,
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id),
      FOREIGN KEY (tariff_id) REFERENCES tariffs(id)
    )
  `);

  // Trips table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      no_trip TEXT NOT NULL UNIQUE,
      officer_id TEXT NOT NULL,
      region_id TEXT NOT NULL,
      status_muatan TEXT NOT NULL,
      route_from TEXT,
      route_to TEXT,
      keterangan TEXT,
      foto_kosong_path TEXT,
      is_synced INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (officer_id) REFERENCES officers(id),
      FOREIGN KEY (region_id) REFERENCES regions(id)
    )
  `);

  // Add vehicle_id to vehicles table after trips exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS trip_vehicles (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )
  `);

  // Seed initial data
  seedData();
}

function seedData() {
  // Check if data exists
  const existingRegion = db.prepare('SELECT COUNT(*) as count FROM regions').get();
  if (existingRegion.count > 0) return;

  // Seed regions
  const regions = [
    { id: uuidv4(), name: 'Badau', code: 'BADAU' },
    { id: uuidv4(), name: 'Sanggau', code: 'SJRE' },
    { id: uuidv4(), name: 'Sambas', code: 'SBDZ' },
  ];

  const insertRegion = db.prepare('INSERT INTO regions (id, name, code) VALUES (?, ?, ?)');
  regions.forEach(r => insertRegion.run(r.id, r.name, r.code));

  // Seed officers with hashed PIN
  const hashedPin = bcrypt.hashSync('123456', 10);
  const officers = [
    { id: uuidv4(), name: 'Budi Santoso', pin: hashedPin, region_id: regions[0].id },
    { id: uuidv4(), name: 'Ahmad Wijaya', pin: hashedPin, region_id: regions[0].id },
    { id: uuidv4(), name: 'Siti Rahayu', pin: hashedPin, region_id: regions[1].id },
  ];

  const insertOfficer = db.prepare('INSERT INTO officers (id, name, pin, region_id) VALUES (?, ?, ?, ?)');
  officers.forEach(o => insertOfficer.run(o.id, o.name, o.pin, o.region_id));

  // Seed tariffs
  const tariffs = [
    { id: uuidv4(), golongan: 'Internal', vehicle_type: 'Truck', loaded_tariff: 0, empty_tariff: 0 },
    { id: uuidv4(), golongan: 'Internal', vehicle_type: 'Mobil', loaded_tariff: 0, empty_tariff: 0 },
    { id: uuidv4(), golongan: 'Internal', vehicle_type: 'Motor', loaded_tariff: 0, empty_tariff: 0 },
    { id: uuidv4(), golongan: 'Eksternal', vehicle_type: 'Truck', loaded_tariff: 150000, empty_tariff: 75000 },
    { id: uuidv4(), golongan: 'Eksternal', vehicle_type: 'Mobil', loaded_tariff: 100000, empty_tariff: 50000 },
    { id: uuidv4(), golongan: 'Eksternal', vehicle_type: 'Motor', loaded_tariff: 50000, empty_tariff: 25000 },
  ];

  const insertTariff = db.prepare('INSERT INTO tariffs (id, golongan, vehicle_type, loaded_tariff, empty_tariff) VALUES (?, ?, ?, ?, ?)');
  tariffs.forEach(t => insertTariff.run(t.id, t.golongan, t.vehicle_type, t.loaded_tariff, t.empty_tariff));

  console.log('Database seeded with initial data');
}

module.exports = db;
