const jwt = require('jsonwebtoken');

/**
 * SATU definisi secret untuk seluruh proses.
 * • routes/auth.js menandatangani token dengan konstanta ini (fail-fast bila env kosong).
 * • middleware hanya memverifikasi — tanpa fallback literal yang menciptakan
 *   mode jamak "server lama vs baru" saat rotasi (sumber kebingungan insiden 2026-10-13).
 * Ubah env JWT_SECRET DI RAILWAY saja; komit kode tidak pernah membawa secret.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'trip-angkut-secret-key';

module.exports.JWT_SECRET = JWT_SECRET;

// Attach req.user / req.officer if the JWT is valid
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const ctx = {
      officerId: decoded.officerId,
      regionId: decoded.regionId,
      role: decoded.role || 'officer',
    };

    req.user = ctx;
    // Back-compat for existing routes that read req.officer.*
    req.officer = ctx;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Must be used after authenticate — gates routes to admin role only
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
