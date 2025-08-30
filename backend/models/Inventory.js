import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  stock: { type: Number, required: true },
  precio: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
