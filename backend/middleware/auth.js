const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function requireAuth(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Authentication is required.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) }, select: { id: true, email: true, role: true, name: true } });
    if (!user || user.email !== payload.email) return res.status(401).json({ error: 'Session is no longer valid.' });
    req.user = user;
    next();
  } catch (_) { return res.status(401).json({ error: 'Session is invalid or expired.' }); }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin permission is required.' });
  next();
}

module.exports = { requireAuth, requireAdmin };
