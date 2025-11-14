import express from 'express'
import { prisma } from '../db/db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const auth = express.Router();

try{
    auth.post('/register', async (req, res) => {
        const { username, email, password } = req.body;
        if(!username || !email || !password)
            return res.status(400).json({message:"please fill all required fields"});
        const exists = await prisma.user.findFirst({
            where: {
                OR: [
                { username: username },
                { email: email },
                ]
            }
        });

        if(exists !== null) 
            return res.status(400).json({message:"email or username already in use"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const createItem = await prisma.user.create({
            data: {
                username: username,
                email:email,
                password:hashedPassword,

            }
        })
    })

    auth.post('/login', async (req, res) => {
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
            return res.status(400).json({message: "password is incorrect"})
        const token = jwt.sign( {id:exists.id, email:exists.email}, process.env.JWT_SECRET, { expiresIn: '2h' } );
        return res.status(200).json({message: "success", token: token})
    })
}catch(err){
    res.status(500).json({message: "authentication service error"})
}

export default auth;