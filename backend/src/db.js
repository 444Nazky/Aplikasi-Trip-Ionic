const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/trip.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

// sql.js wrapper that mimics better-sqlite3 API
const dbWrapper = {
  prepare(sql) {
    return {
      run(...params) {
        db.run(sql, params);
        saveDb();
      },
      get(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      }
    };
  },
  exec(sql) {
    db.run(sql);
  },
  get db() { return db; }
};

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

async function loadDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    initialize();
  }

  migrate();
  return dbWrapper;
}

// Schema migrations for databases created before the column existed.
// Runs on every boot; swallows the "duplicate column" error when present.
function migrate() {
  try {
    db.run(`ALTER TABLE tariffs ADD COLUMN description TEXT DEFAULT ''`);
    saveDb();
  } catch (e) {
    // column already exists — nothing to do
  }
}

function initialize() {
  // Regions table
  db.run(`
    CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Officers table
  db.run(`
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
  db.run(`
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
  db.run(`
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
  db.run(`
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

  // Trip_vehicles junction table
  db.run(`
    CREATE TABLE IF NOT EXISTS trip_vehicles (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )
  `);

  seedData();
  saveDb();
}

function seedData() {
  // Check if data exists
  const stmt = db.prepare('SELECT COUNT(*) as count FROM regions');
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();
  if (result.count > 0) return;

  // Seed regions
  const regions = [
    { id: uuidv4(), name: 'Badau', code: 'BADAU' },
    { id: uuidv4(), name: 'Sanggau', code: 'SJRE' },
    { id: uuidv4(), name: 'Sambas', code: 'SBDZ' },
    { id: uuidv4(), name: 'Entikong', code: 'ENTIKONG' },
  ];

  const insertRegion = db.prepare('INSERT INTO regions (id, name, code) VALUES (?, ?, ?)');
  regions.forEach(r => {
    insertRegion.bind([r.id, r.name, r.code]);
    insertRegion.step();
    insertRegion.reset();
  });
  insertRegion.free();

  // Seed officers with hashed PIN
  const hashedPin = bcrypt.hashSync('123456', 10);
  const officers = [
    { id: 1, name: 'Budi Santoso', pin: hashedPin, region_id: regions[0].id },
    { id: 2, name: 'Andi Pratama', pin: hashedPin, region_id: regions[0].id },
    { id: 3, name: 'Siti Rahayu', pin: hashedPin, region_id: regions[0].id },
    { id: 4, name: 'Rizky Maulana', pin: hashedPin, region_id: regions[3].id },
    { id: 5, name: 'Dewi Kusuma', pin: hashedPin, region_id: regions[3].id },
  ];

  const insertOfficer = db.prepare('INSERT INTO officers (id, name, pin, region_id) VALUES (?, ?, ?, ?)');
  officers.forEach(o => {
    insertOfficer.bind([String(o.id), o.name, o.pin, o.region_id]);
    insertOfficer.step();
    insertOfficer.reset();
  });
  insertOfficer.free();

  // Seed tariffs
  const tariffs = [
    { id: uuidv4(), golongan: 'I', vehicle_type: 'Motor', loaded_tariff: 15000, empty_tariff: 8000 },
    { id: uuidv4(), golongan: 'II', vehicle_type: 'Mobil', loaded_tariff: 45000, empty_tariff: 20000 },
    { id: uuidv4(), golongan: 'III', vehicle_type: 'Truck Kecil', loaded_tariff: 120000, empty_tariff: 55000 },
    { id: uuidv4(), golongan: 'IV', vehicle_type: 'Truck Sedang', loaded_tariff: 280000, empty_tariff: 130000 },
    { id: uuidv4(), golongan: 'V', vehicle_type: 'Truck Besar', loaded_tariff: 450000, empty_tariff: 200000 },
  ];

  const insertTariff = db.prepare('INSERT INTO tariffs (id, golongan, vehicle_type, loaded_tariff, empty_tariff) VALUES (?, ?, ?, ?, ?)');
  tariffs.forEach(t => {
    insertTariff.bind([t.id, t.golongan, t.vehicle_type, t.loaded_tariff, t.empty_tariff]);
    insertTariff.step();
    insertTariff.reset();
  });
  insertTariff.free();

  console.log('Database seeded with initial data');
}

// Export async initialization
module.exports = {
  loadDb,
  db: dbWrapper,
  initialize
};
