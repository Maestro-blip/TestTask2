const db = require('../config/db.js')

class events{

static async create(title,description,date,location,capacity,userID){
    const [result] = await db.execute(`INSERT INTO event (title,description,date,location,capacity,created_by) VALUES (?,?,?,?,?,?)`,[title,description,date,location,capacity,userID]);
        return result.insertId;

}
static async getAll(offset){
     let limit = 5;
            const [rows] = await db.execute(
        `SELECT * FROM event ORDER BY date DESC LIMIT ? OFFSET ?`, 
        [limit, offset]
    );
         if(result.length === 0)
            return null
        return result;
}
static async getByID(eventID){
    let result;
            [result] = await db.execute(`Select * FROM event WHERE event_id = ?`,[eventID]);
          if(result.length === 0)
            return null
        return result
}
static async delete(eventID,userID,userRole){
        let result;
        if(userRole =='Admin')
        [result]= await db.execute(`DELETE FROM event WHERE event_id = ?`,[eventID])
        else
        [result]= await db.execute(`DELETE FROM event WHERE event_id = ? AND created_by = ?`,[eventID,userID])
            return result.insertId;
}

} 

module.exports = events;