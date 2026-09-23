const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all officers — officer database is admin-only
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const officers = db.prepare(`
      SELECT o.id, o.name, o.region_id, o.is_active, r.name as region_name, r.code as region_code
      FROM officers o
      JOIN regions r ON o.region_id = r.id
      ORDER BY o.name
    `).all();
    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch officers' });
  }
});

// Create officer
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, pin, regionId } = req.body;
    const { v4: uuidv4 } = require('uuid');

    const hashedPin = bcrypt.hashSync(pin, 10);
    const id = uuidv4();

    db.prepare(`
      INSERT INTO officers (id, name, pin, region_id)
      VALUES (?, ?, ?, ?)
    `).run(id, name, hashedPin, regionId);

    res.status(201).json({ id, name, regionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create officer' });
  }
});

// Update officer PIN
router.put('/:id/pin', authenticate, requireAdmin, (req, res) => {
  try {
    const { pin } = req.body;
    const hashedPin = bcrypt.hashSync(pin, 10);

    db.prepare(`UPDATE officers SET pin = ? WHERE id = ?`).run(hashedPin, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update PIN' });
  }
});

// Toggle officer status
router.put('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { isActive } = req.body;
    db.prepare(`UPDATE officers SET is_active = ? WHERE id = ?`).run(isActive ? 1 : 0, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
