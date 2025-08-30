
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';


import userRoutes from './routes/users.js';
import inventoryRoutes from './routes/inventory.js';
import purchasesRoutes from './routes/purchases.js';


const app = express();
app.use(cors());
app.use(express.json());

// Configurar carpeta pública para archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB local por defecto
const MONGODB_URI = 'mongodb://localhost:27017/dieselpro';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado')).catch(err => console.error('MongoDB error', err));



app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchases', purchasesRoutes);


// Servir index.html para la ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
