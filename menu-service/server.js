import express from 'express';
import 'dotenv/config';
import { connectDB } from './db/connect.js';
import { menuRoutes } from './routes/menuRoutes.js';

const app = express();
app.use(express.json());

app.use('/', menuRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, async () => {
  await connectDB().catch((err) => console.error(err));
  console.log(`Menu service running on http://localhost:${PORT}`);
});
