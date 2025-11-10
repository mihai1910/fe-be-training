import express from 'express'
import 'dotenv/config'
import { connectDB } from "./db/connect.js"
import menuRoutes from './routes/menuRoutes.js'

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use('/api/menu', menuRoutes)

app.listen(PORT, (err) => {
    if(err)
        return new Error(500, "Server issue");
    console.log(`Menu service is running on port ${PORT}`)
})