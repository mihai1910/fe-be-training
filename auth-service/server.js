import express from 'express'
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`The server is live on port ${PORT}`)
})