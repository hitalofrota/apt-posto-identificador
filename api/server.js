import express from 'express';
import cors from 'cors';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import blockRoutes from './src/routes/blockRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/appointments', appointmentRoutes);
app.use('/blocks', blockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));