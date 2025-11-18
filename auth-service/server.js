import express from 'express'
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js'

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});