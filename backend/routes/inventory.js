import express from 'express';
import Inventory from '../models/Inventory.js';

const router = express.Router();

// Obtener todo el inventario
router.get('/', async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

// Agregar item
router.post('/', async (req, res) => {
  const { sku, nombre, stock, precio } = req.body;
  if (!sku || !nombre || stock == null || precio == null) return res.status(400).json({ error: 'Faltan datos' });
  const exists = await Inventory.findOne({ sku });
  if (exists) return res.status(409).json({ error: 'SKU ya existe' });
  const item = new Inventory({ sku, nombre, stock, precio });
  await item.save();
  res.json({ message: 'Item agregado', item });
});

// Actualizar item
router.put('/:sku', async (req, res) => {
  const { nombre, stock, precio } = req.body;
  const item = await Inventory.findOneAndUpdate(
    { sku: req.params.sku },
    { nombre, stock, precio },
    { new: true }
  );
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json({ message: 'Actualizado', item });
});

// Eliminar item
router.delete('/:sku', async (req, res) => {
  const item = await Inventory.findOneAndDelete({ sku: req.params.sku });
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

export default router;
