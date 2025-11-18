import express from 'express'
import { prisma } from '../db/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import 'dotenv/config'
import { authenticate } from '../middleware/authMiddleware.js'

const auth = express.Router();

auth.get('/me', (req, res) => {
    return res.status(200).json({ message: "OK", user: req.user })
})

auth.post('/register', async (req, res, next) => {
    try{
    const { username, email, password } = req.body;
    if(!username || !email || !password)
        return res.status(400).json({message:"Please fill all required fields"});
    const exists = await prisma.user.findFirst({
        where: {
            OR: [
            { username: username },
            { email: email },
            ]
        }
    });

    if(exists !== null) 
        return res.status(400).json({message:"Email or username already in use"})

    const hashedPassword = await bcrypt.hash(password, 10)

    const createItem = await prisma.user.create({
        data: {
            username: username,
            email:email,
            password:hashedPassword,
        }
    })
    return res.status(200).json({message: "Success", item: createItem})
}catch(err){
    next(err);
}})

auth.post('/login', async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const exists = await prisma.user.findFirst({
            where:{
                OR: [
                    { username: username },
                    { email: email },
            ]
            }

        })
        if(exists === null)
            return res.status(400).json({message:"Invalid account credentials"})
        
        const isValid = await bcrypt.compare(password, exists.password);
        if(!isValid)
            return res.status(400).json({message: "Password is incorrect"})
        const refreshToken = crypto.randomBytes(40).toString("hex");
        const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 )
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userID: exists.id,
                expiresAt: expiresAt
            }
        });
        const token = jwt.sign( {id:exists.id, email:exists.email}, process.env.JWT_SECRET, { expiresIn: '2h' } );
        return res.status(200).json({message: "success", token: token, refreshToken: refreshToken})
} catch(err){
    next(err);
}})

auth.post('/refresh', async (req, res, next) => {
    try{
        const { refreshToken } = req.body;

        if(!refreshToken)
            return res.status(400).json({ message:"Refresh token required" });
        
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        })

        if ( storedToken === null )
            return res.status(400).json({ message: "Refresh token doesn't exist" })

        if ( storedToken.expiresAt < new Date() )
            return res.status(400).json({ message: "Refresh token expired" })

        const user = await prisma.user.findUnique({
            where: { id: storedToken.userID }
        })

        const newAccessToken = jwt.sign( { id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" } )
        await prisma.refreshToken.delete({
            where: { token: refreshToken },
        })

        const newRefreshToken = crypto.randomBytes(40).toString("hex");
        const newExpiresAt = new Date( Date.now() + 14 * 24 * 60 * 60 * 1000 );

        await prisma.refreshToken.create({
            data:{
                token: newRefreshToken,
                userID: user.id,
                expiresAt: newExpiresAt
            }
        })
        return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    }catch(err){
        next(err);
    }})

auth.post('/logout', async (req, res, next) => {
    try{
        const { refreshToken } = req.body;
        if(!refreshToken)
            return res.status(400).json({ message: "Provide refresh token for logout" })
        
        const targetToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        })

        if(targetToken === null)
            return res.status(400).json({ message: "Invalid refresh token" })

        await prisma.refreshToken.delete({
            where: { token: refreshToken }
        })

        return res.status(200).json({ message: "Logged out successfully" })

    }catch(err){
        next(err);
    }})

auth.use((err, req, res, next) => {
    console.error("Auth Service Error", err.message);
    return res.status(500).json({ message: err.message })
})

export default auth;