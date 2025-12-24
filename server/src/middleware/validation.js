const Ajv = require("ajv");
const express = require('express');
const ajv = new Ajv();
const authSchema = require('../schema/auth.json')


function validDate(req,res,next){
const validate = ajv.compile(authSchema)

const valid = validate(req.body)
    if(!valid){
        console.log(validate.errors)
        return res.status(400).send('Bed user data')
}

next()
}

module.exports = { validDate }
