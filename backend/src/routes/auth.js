const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'trip-angkut-secret-key';

// Login with PIN
router.post('/login', (req, res) => {
  try {
    const { officerId, pin } = req.body;

    if (!officerId || !pin) {
      return res.status(400).json({ error: 'Officer ID and PIN required' });
    }

    const officer = db.prepare(`
      SELECT o.*, r.name as region_name, r.code as region_code
      FROM officers o
      JOIN regions r ON o.region_id = r.id
      WHERE o.id = ? AND o.is_active = 1
    `).get(officerId);

    if (!officer) {
      return res.status(401).json({ error: 'Officer not found' });
    }

    const validPin = bcrypt.compareSync(pin, officer.pin);
    if (!validPin) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    const token = jwt.sign(
      { officerId: officer.id, regionId: officer.region_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      officer: {
        id: officer.id,
        name: officer.name,
        regionId: officer.region_id,
        regionName: officer.region_name,
        regionCode: officer.region_code
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get officers by region (for device lock)
router.get('/officers/:regionCode', (req, res) => {
  try {
    const { regionCode } = req.params;

    const officers = db.prepare(`
      SELECT o.id, o.name, r.code as region_code
      FROM officers o
      JOIN regions r ON o.region_id = r.id
      WHERE r.code = ? AND o.is_active = 1
    `).all(regionCode);

    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch officers' });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const officer = db.prepare(`
      SELECT o.*, r.name as region_name, r.code as region_code
      FROM officers o
      JOIN regions r ON o.region_id = r.id
      WHERE o.id = ?
    `).get(decoded.officerId);

    if (!officer) {
      return res.status(401).json({ valid: false });
    }

    res.json({
      valid: true,
      officer: {
        id: officer.id,
        name: officer.name,
        regionId: officer.region_id,
        regionName: officer.region_name,
        regionCode: officer.region_code
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
