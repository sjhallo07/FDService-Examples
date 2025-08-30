import express from 'express';
import jwt from 'jsonwebtoken';
import Purchase from '../models/Purchase.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dieselprosecret';

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register a new purchase
router.post('/', authenticateToken, (req, res) => {
  const { items, total } = req.body;
  if (!items || !Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: 'Datos de compra inválidos' });
  }
  const purchase = {
    userId: req.user.username,
    items,
    total,
    date: new Date().toISOString(),
  };
  Purchase.addPurchase(purchase);
  res.status(201).json({ message: 'Compra registrada', purchase });
});

// Get purchase history for logged-in user
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.username;
  const purchases = Purchase.getPurchasesByUser(userId);
  res.json({ purchases });
});

export default router;
