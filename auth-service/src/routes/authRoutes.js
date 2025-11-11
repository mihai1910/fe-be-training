// src/routes/authRoutes.js
import express from "express";
import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";

export const authRoutes = express.Router();

authRoutes.post("/register", async (req, res, next) => {
  try {
    const { email, password, profileName } = req.body;

    if (!email || !password) throw new Error("Email and password are required");

    let profile = await prisma.profile.findUnique({ where: { name: profileName || "viewer" } });
    if (!profile) {
      profile = await prisma.profile.create({
        data: { name: profileName || "viewer", description: "Default user" },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, passwordHash, profileId: profile.id },
    });

    res.status(201).json({ id: newUser.id, email: newUser.email, profile: profile.name });
  } catch (err) {
    next(err);
  }
});

authRoutes.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { profile: true } });
  res.json(users);
});
