const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get all tariffs
router.get('/', (req, res) => {
  try {
    const tariffs = db.prepare(`
      SELECT * FROM tariffs WHERE is_active = 1 ORDER BY golongan, vehicle_type
    `).all();
    res.json(tariffs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tariffs' });
  }
});

// Create tariff
router.post('/', authenticate, (req, res) => {
  try {
    const { golongan, vehicleType, loadedTariff, emptyTariff } = req.body;
    const { v4: uuidv4 } = require('uuid');

    const id = uuidv4();
    db.prepare(`
      INSERT INTO tariffs (id, golongan, vehicle_type, loaded_tariff, empty_tariff)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, golongan, vehicleType, loadedTariff, emptyTariff);

    res.status(201).json({ id, golongan, vehicleType, loadedTariff, emptyTariff });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tariff' });
  }
});

// Update tariff
router.put('/:id', authenticate, (req, res) => {
  try {
    const { loadedTariff, emptyTariff, isActive } = req.body;

    db.prepare(`
      UPDATE tariffs SET loaded_tariff = ?, empty_tariff = ?, is_active = ?
      WHERE id = ?
    `).run(loadedTariff, emptyTariff, isActive ? 1 : 0, req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tariff' });
  }
});

module.exports = router;
