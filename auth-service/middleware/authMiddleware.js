import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function authenticate(req, res, next) {
    try{
        const authHeader = req.headers["authorization"];

        if(!authHeader)
            return res.status(401).json({ message: "Missing auth header" })

        const [type, token] = authHeader.split(" ");

        if(type !== "Bearer" || !token)
            return res.status(401).json ({ message: "Invalid auth format" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next()
    }catch(err){
        return res.status(401).json({ message: "Invalid or expired token" });
    }}