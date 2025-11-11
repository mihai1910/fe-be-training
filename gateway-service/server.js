import express from "express";
import cors from "cors";
import "dotenv/config";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";

const app = express();
app.use(cors());
app.use(helmet());


app.use(
  "/api/menu",
  createProxyMiddleware({
    target: process.env.MENU_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/menu": "" },
  })
);
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Gateway running on port ${process.env.PORT}`)
);
