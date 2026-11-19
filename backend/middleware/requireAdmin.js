const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.trim().toLowerCase()
    : '';
  const secret = process.env.JWT_SECRET;
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';

  if (!adminEmail || !secret) {
    return res.status(503).json({
      message: 'Admin access is not configured on the server.'
    });
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const user = jwt.verify(token, secret);
    if (
      user.role !== 'admin' ||
      typeof user.email !== 'string' ||
      user.email.toLowerCase() !== adminEmail
    ) {
      return res.status(403).json({ message: 'Admin access only.' });
    }

    req.admin = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session has expired. Log in again.' });
  }
}

module.exports = requireAdmin;
