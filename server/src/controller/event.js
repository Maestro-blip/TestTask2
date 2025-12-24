const express = require('express');
const eventModels = require('../models/event.js');

class event {

static async create(req,res){
    try{
        const { userID, role } = req.user;


        const currentDate = new Date()
        const validDate = currentDate.toISOString().split("T")[0] 
        const { title, description, date, location, capacity} = req.body;

         if(validDate > date )
            return res.status(400).send("Data is not correct");

        if(!userID)
             return res.status(400).send("User didn't login");

        await eventModels.create(title, description, date, location, capacity,userID);
            return res.status(201).send("Event created")

    }catch(err){
        console.error(err);
        res.status(500).send("Поламалося")
    }
}
static async read (req,res){
    try{
        const { page, search,sort } = req.params
        let offset = (parseInt(page,10) - 1 ) * 5
        console.log(page)

        const [result] = await eventModels.getAll(offset);
        return res.status(200).json(result);



    }catch(err){
        console.error(err);
        res.status(500).send("Поламалося")
    }
}
static async readByID (req,res){
    try{
    const eventID = req.params.id
        console.log(eventID);
    const [result] = await eventModels.getByID(eventID);
    return res.status(200).json(result);
    }catch(err){
        console.error(err);
        res.status(500).send("Read error")
    }    
}
static async delete (req,res){
    try{
        const { userID, role } = req.user;
        const eventID = req.params.id

        await eventModels.delete(eventID,userID,role)

        return res.status(200).json({
            message: "Delete succesfully",
            id: eventID})

    }catch(err){
        console.error(err);
        res.status(500).send("Delete error")
    }   
}


}

module.exports = event;