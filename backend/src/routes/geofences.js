const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { randomUUID } = require('crypto');
// Bentuk baris SQLite → kontrak JSON yang dipakai mobile & dashboard admin.
function shape(rows) {
  return (rows || []).map(r => ({
    id: r.id,
    locationName: r.location_name,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    radiusMeters: Number(r.radius_meters) || 100,
    allowedRouteCodes: String(r.allowed_route_codes ?? '').split(',').map(s => s.trim()).filter(Boolean),
    allowedDirections: String(r.allowed_directions ?? '').split(',').map(s => s.trim()).filter(Boolean),
    description: r.description ?? '',
  }));
}

// GET semua rule — publik untuk petugas (tanpa data sensitif); admin juga bisa.
router.get('/', authenticate, (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM geofences ORDER BY location_name`).all();
    res.json(shape(rows));
  } catch (error) {
    console.error('Get geofences error:', error);
    res.status(500).json({ error: 'Failed to fetch geofences' });
  }
});

// POST rule baru (admin)
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { locationName, latitude, longitude, radiusMeters, allowedRouteCodes, allowedDirections, description } = req.body || {};
    if (!locationName || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'locationName, latitude, longitude wajib diisi' });
    }
    const id = randomUUID();
    db.prepare(`
      INSERT INTO geofences (id, location_name, latitude, longitude, radius_meters, allowed_route_codes, allowed_directions, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      String(locationName),
      Number(latitude),
      Number(longitude),
      Number(radiusMeters) || 100,
      Array.isArray(allowedRouteCodes) ? allowedRouteCodes.join(',') : String(allowedRouteCodes ?? ''),
      Array.isArray(allowedDirections) ? allowedDirections.join(',') : String(allowedDirections ?? ''),
      description ? String(description) : '',
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error('Create geofence error:', error);
    res.status(500).json({ error: 'Failed to create geofence' });
  }
});

// PUT rule (admin) — update sebagian kolom
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const id = String(req.params.id);
    const row = db.prepare(`SELECT id FROM geofences WHERE id = ?`).get(id);
    if (!row) return res.status(404).json({ error: 'Geofence not found' });

    const b = req.body || {};
    const sets = [];
    const args = [];
    if (b.locationName !== undefined) { sets.push('location_name = ?'); args.push(String(b.locationName)); }
    if (b.latitude !== undefined) { sets.push('latitude = ?'); args.push(Number(b.latitude)); }
    if (b.longitude !== undefined) { sets.push('longitude = ?'); args.push(Number(b.longitude)); }
    if (b.radiusMeters !== undefined) { sets.push('radius_meters = ?'); args.push(Number(b.radiusMeters) || 100); }
    if (b.allowedRouteCodes !== undefined) {
      sets.push('allowed_route_codes = ?');
      args.push(Array.isArray(b.allowedRouteCodes) ? b.allowedRouteCodes.join(',') : String(b.allowedRouteCodes));
    }
    if (b.allowedDirections !== undefined) {
      sets.push('allowed_directions = ?');
      args.push(Array.isArray(b.allowedDirections) ? b.allowedDirections.join(',') : String(b.allowedDirections));
    }
    if (b.description !== undefined) { sets.push('description = ?'); args.push(String(b.description ?? '')); }

    if (sets.length) {
      args.push(id);
      db.prepare(`UPDATE geofences SET ${sets.join(', ')} WHERE id = ?`).run(...args);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Update geofence error:', error);
    res.status(500).json({ error: 'Failed to update geofence' });
  }
});

// DELETE rule (admin)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    db.prepare(`DELETE FROM geofences WHERE id = ?`).run(String(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete geofence' });
  }
});

module.exports = router;
