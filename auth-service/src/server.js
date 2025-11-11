import express from "express";
import helmet from "helmet";
import cors from "cors";
import { PORT } from "./config/env.js";
import { prisma } from "./db/prisma.js";
import { authRoutes } from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/", authRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, async () => {
  console.log(`Auth-service running on port ${PORT}`);
  await prisma.$connect();
  console.log("Connected to PostgreSQL");
});
