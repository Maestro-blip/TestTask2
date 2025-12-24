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

       if(isCreator.created_by == userID)
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
static async readReqById(req, res) {
        try {
            const { userID } = req.user;
            const { eventId } = req.params;

            const [eventData] = await eventModels.getByID(eventId);
            if (!eventData || eventData.length === 0) {
                return res.status(404).json({ message: "Event not found" });
            }

            if (eventData[0].created_by != userID) {
                return res.status(403).json({ message: "Access denied" });
            }

            const [participants] = await reqModels.getRegistrationById(eventId);
            return res.status(200).json(participants);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
    }

}

module.exports = regController;