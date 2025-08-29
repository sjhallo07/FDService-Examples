import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Obtener todos los usuarios (solo para admin/demo)
router.get('/', async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

// Obtener usuario por username
router.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username }, '-password');
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

// Actualizar usuario (solo password, demo)
router.put('/:username', async (req, res) => {
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

// Eliminar usuario
router.delete('/:username', async (req, res) => {
  const user = await User.findOneAndDelete({ username: req.params.username });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ message: 'Usuario eliminado' });
});

export default router;
