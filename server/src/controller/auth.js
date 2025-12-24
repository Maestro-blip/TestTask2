const express = require('express');
const authModels = require('../models/auth.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

class auth{

static async register(req,res){
    try{
    const { email, password } = req.body

        console.log(email,password)

    const user = await authModels.getByEmail(email);

    if(user)
        return res.status(400).send("User exist");

    const hashPassword = await bcrypt.hash(password,10)

   const result = await authModels.create(email,hashPassword)

        return res.status(201).json({
        message: "User create succesfull",
        UserID: result})
    }catch(err){
          console.error(err);
        res.status(500).send("Register error")
    }

}
static async login(req,res){
    try{
        const { email, password } = req.body;
        const user = await authModels.getByEmail(email)

            if(!user)
                return res.status(400).send("Invalid email or password")

        let isAdmin = user.is_admin;

            if(isAdmin == 'yes')
                isAdmin = true
            else
                isAdmin = false
            
        const validPassword = await bcrypt.compare(password,user.password)

            if(!validPassword)
                return res.status(400).send("Invalid email or password");

            const key = jwt.sign({
                userID: user.user_id,
                role: isAdmin ? 'Admin' : 'User'
            },process.env.jwtSecret)

            return res.json({token:key})


        }catch(err){
            console.error(err);
            res.status(500).send("Login error")
        }

}


}

module.exports = auth;