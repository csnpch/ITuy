const db = require('./../../database')
const securify = require('./../../middlewares/security')
const clientService = require('./clientService')
const dbDict = require('./../../database/dictonary')



const verifySignIn = async (username, password) => {
    
    let client = await (await clientService.findByKey('username', username)).rows[0]

    if (!client) {
        return 'not_found_client'
    } else if (!await securify.passwordVerify(password, client.salt, client.password)) {
        return 'client_pass_invalid'
    } else if (client.role === null) {
        return 'account_not_allow'
    }
    let accessToken = await securify.createJWToken(client)

    delete client.salt
    delete client.password

    return { client, accessToken }
}


const createRequestAccount = async (username, section) => {

    let client = await (await clientService.findByKey('username', username)).rows[0]
    if (client) {
        return 'username_already'
    }

    const { password_encrypt, salt } = await securify.passwordCreate(username)
    return await db.query(`
        INSERT INTO 
            ${dbDict.tableNames.client} 
            (email, username, password, salt, section)
        VALUES 
            ($1, $2, $3, $4, $5)
    `, [
        `s${username}@email.kmutnb.ac.th`, 
        username,
        password_encrypt, 
        salt,
        section
    ])

} 


module.exports = {
    createRequestAccount,
    verifySignIn,
}