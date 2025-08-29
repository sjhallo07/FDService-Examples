import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB local por defecto
const MONGODB_URI = 'mongodb://localhost:27017/dieselpro';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado')).catch(err => console.error('MongoDB error', err));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('DieselPro Backend API running');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
