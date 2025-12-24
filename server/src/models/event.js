const db = require('../config/db.js')

class events{

static async create(title,description,date,location,capacity,userID){
    const [result] = await db.execute(`INSERT INTO event (title,description,date,location,capacity,created_by) VALUES (?,?,?,?,?,?)`,[title,description,date,location,capacity,userID]);
        return result.insertId;

}
static async getAll(search,sort){
    let result;
    let sql = `Select * FROM event`;


    console.log(search)
    if (search && search.trim() !== "") {
        sql += ` WHERE title LIKE '%${search}%'`; 
    }

    if (sort === 'title'){
        sql += " ORDER BY title ASC";
    }    
    else {
        sql += " ORDER BY date DESC";  
    }

        result = await db.execute(sql);
        console.log(sql)
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