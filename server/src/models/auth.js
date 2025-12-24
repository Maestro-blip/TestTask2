const db = require('../config/db.js');

class authUser{

    static async create(email,hashpassword){
        const [result] = await db.execute(`INSERT INTO user (email,password) VALUES (?,?)`,[email,hashpassword]);
        return result.insertId;
    }
    
    static async getByEmail(email){
        const [result] = await db.execute(`SELECT * FROM user WHERE email = ?`,[email])
        if(result.length === 0)
            return null
        return result[0]
    }
}

module.exports = authUser;