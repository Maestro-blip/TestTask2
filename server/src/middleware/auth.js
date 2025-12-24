const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();


class authMiddleware{

    static async checkToken(req,res,next){
        try{
            if(!req.headers.authorization)
                return res.status(401).json({ message: "User didn't login" });

            const token = req.headers.authorization.split(' ')[1];

            if(!token)
                return res.status(401).json({ message: "Token format invalid" });

            const decodedData = jwt.verify(token,process.env.jwtSecret);
            req.user = decodedData;
            console.log(decodedData)
            next();
        }catch(err){
            console.error(err);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    }

}

module.exports = authMiddleware;