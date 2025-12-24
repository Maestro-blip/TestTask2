const express = require('express');
const reqModels = require('../models/registration.js');
const eventModels = require('../models/event.js');

class regController{

static async createReg(req,res){
    try{
    const { userID } = req.user;
    
    const eventId = req.body.eventId;

    const user = await reqModels.getRegistrationById(eventId,userID)
    if(user)
        return res.status(400).json({message:"User already is register"})

     const isCreator = await eventModels.getByID(eventId);

       if(isCreator.created_by = userID)
         return res.status(400).json({message:"The creator cannot register."})

    await reqModels.register(eventId,userID)
    return res.status(201).send("Registration create");
    }
    catch(err){
        console.log(err)
         return res.status(400).json({message:"Error"})
    }
}
static async readReg(req,res){
    const { userID } = req.user;
    const result =  await reqModels.getRegistration(userID);
    return res.status(200).json(result);

}

}

module.exports = regController;