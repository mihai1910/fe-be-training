import express from 'express'
import 'dotenv/config'
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const menuURL = process.env.MENU_SERVICE_URL;
const authURL = process.env.AUTH_SERVICE_URL;

app.use(createProxyMiddleware({
    target: menuURL,
    changeOrigin: true,
    pathRewrite: {'^/api/menu': '' },
}))

app.use(createProxyMiddleware({
    target:authURL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': ''}
}))

app.listen(PORT, (err) => {
    if(err)
        return new Error(err.messge);
    console.log(`Gateway service running on port ${PORT}`);
})