const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'trip-angkut-secret-key';

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.officer = {
      officerId: decoded.officerId,
      regionId: decoded.regionId
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authenticate };
