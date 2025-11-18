import express from "express";
import cors from "cors";
import "dotenv/config";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken"

const app = express();
app.use(morgan("combined"))
app.use(cors());
app.use(helmet());

function Authenticate(req, res, next){
try{
if(req.path.startsWith("/api/auth") || req.path.startsWith("/api/public"))
    return next();

const authHeader = req.headers["authorization"];

if(!authHeader)
    return res.status(401).json({ message: "Missing token" });

const [type, token] = authHeader.trim().split(" ");

if(type.toLowerCase() !== "bearer")
    return res.status(401).json({ message: "Invalid token format" })

  if(!token)
    return res.status(401).json({ message: "Token not provided" })

  let decoded;
  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch(err){
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  req.user = decoded;
  next()

}catch(err){
  next(err)
}}

app.use(Authenticate);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
  }))

app.use('/api/tasks', 
  createProxyMiddleware({
    target: process.env.TASKS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {"^/api/tasks": ""},
  }))

app.use('/api/users', 
  createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/users": ""},
}))

app.use('/api/public',
  createProxyMiddleware({
    target: process.env.PUBLIC_URL,
    changeOrigin: true,
    pathRewrite: {"^/api/public": ""},
  }))

app.listen(process.env.PORT, () =>
  console.log(`Gateway running on port ${process.env.PORT}`)
);
