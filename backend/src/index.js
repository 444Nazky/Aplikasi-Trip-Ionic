const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const vehicleRoutes = require('./routes/vehicles');
const tariffRoutes = require('./routes/tariffs');
const officerRoutes = require('./routes/officers');
const regionRoutes = require('./routes/regions');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tariffs', tariffRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  db.initialize();
});

module.exports = app;
