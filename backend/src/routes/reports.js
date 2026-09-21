const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get summary stats
router.get('/summary', authenticate, (req, res) => {
  try {
    const { startDate, endDate, regionId } = req.query;

    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(t.created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Total trips
    const tripCount = db.prepare(`
      SELECT COUNT(*) as count FROM trips t
      WHERE 1=1 ${dateFilter}
    `).get(...params);

    // Total vehicles
    const vehicleCount = db.prepare(`
      SELECT COUNT(*) as count FROM vehicles v
      JOIN trips t ON v.trip_id = t.id
      WHERE 1=1 ${dateFilter}
    `).get(...params);

    // Total revenue (from external tariffs only)
    const revenue = db.prepare(`
      SELECT COALESCE(SUM(v.tariff_amount), 0) as total FROM vehicles v
      JOIN trips t ON v.trip_id = t.id
      WHERE v.golongan = 'Eksternal' ${dateFilter}
    `).get(...params);

    res.json({
      totalTrips: tripCount.count,
      totalVehicles: vehicleCount.count,
      totalRevenue: revenue.total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Get trips report
router.get('/trips', authenticate, (req, res) => {
  try {
    const { startDate, endDate, route, golongan, status } = req.query;

    let query = `
      SELECT t.*, r.name as region_name,
        (SELECT COUNT(*) FROM trip_vehicles tv WHERE tv.trip_id = t.id) as vehicle_count,
        (SELECT SUM(v.tariff_amount) FROM vehicles v WHERE v.trip_id = t.id) as trip_revenue
      FROM trips t
      JOIN regions r ON t.region_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (startDate && endDate) {
      query += ` AND DATE(t.created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    if (route) {
      query += ` AND (t.route_from = ? OR t.route_to = ?)`;
      params.push(route, route);
    }

    if (golongan) {
      query += ` AND EXISTS (SELECT 1 FROM vehicles v WHERE v.trip_id = t.id AND v.golongan = ?)`;
      params.push(golongan);
    }

    if (status) {
      query += ` AND t.status_muatan = ?`;
      params.push(status);
    }

    query += ` ORDER BY t.created_at DESC LIMIT 200`;

    const trips = db.prepare(query).all(...params);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Export trips as CSV (simple implementation)
router.get('/trips/export', authenticate, (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT t.no_trip, t.status_muatan, t.route_from, t.route_to, t.created_at,
        r.name as region,
        (SELECT COUNT(*) FROM trip_vehicles tv WHERE tv.trip_id = t.id) as vehicle_count,
        (SELECT SUM(v.tariff_amount) FROM vehicles v WHERE v.trip_id = t.id) as revenue
      FROM trips t
      JOIN regions r ON t.region_id = r.id
    `;
    const params = [];

    if (startDate && endDate) {
      query += ` WHERE DATE(t.created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    query += ` ORDER BY t.created_at DESC`;

    const trips = db.prepare(query).all(...params);

    // Generate CSV
    const headers = ['No Trip', 'Status', 'From', 'To', 'Date', 'Region', 'Vehicles', 'Revenue'];
    const rows = trips.map(t => [
      t.no_trip,
      t.status_muatan,
      t.route_from || '',
      t.route_to || '',
      t.created_at,
      t.region,
      t.vehicle_count,
      t.revenue || 0
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=trips-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export' });
  }
});

module.exports = router;
