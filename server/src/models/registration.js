const db = require('../config/db.js');


class registrations {

static async register(event_id,userID){
    const [result] = await db.execute(`INSERT INTO registration (event_id,user_id) VALUES (?,?)`,[event_id,userID])
    return result.insertId;
}
    
    static async getRegistrationById(event_id,userID){
        const [result] = await db.execute(`SELECT * FROM registration WHERE event_id = ? AND user_id = ?`,[event_id,userID])
        if(result.length === 0)
            return null
        return result[0]
    }

 static async getRegistration(userID){
        const [result] = await db.execute(`SELECT * FROM registration WHERE user_id = ?`,[userID])
        if(result.length === 0)
            return null
        return result;
    }
}

module.exports = registrations;