import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();


import jwt from 'jsonwebtoken';
const JWT_SECRET = 'dieselprosecret';

// Middleware de autenticación JWT
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Obtener todos los usuarios (requiere login)
router.get('/', authMiddleware, async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});
// Registro de usuario (para frontend)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });
  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ error: 'Usuario ya existe' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();
  res.json({ message: 'Usuario registrado' });
});

// Login de usuario (para frontend)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});


// Obtener usuario por username (requiere login)
router.get('/:username', authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.params.username }, '-password');
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});


// Actualizar usuario (requiere login)
router.put('/:username', authMiddleware, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Falta password' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    { password: hash },
    { new: true, fields: '-password' }
  );
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ message: 'Contraseña actualizada', user });
});


// Eliminar usuario (requiere login)
router.delete('/:username', authMiddleware, async (req, res) => {
  const user = await User.findOneAndDelete({ username: req.params.username });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ message: 'Usuario eliminado' });
});

export default router;
