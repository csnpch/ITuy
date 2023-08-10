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


const forceChangePassword = async (client_username, new_password) => {

    let client = await (await clientService.findByKey('username', client_username)).rows[0]

    if (!client) {
        return 'not_found_client'
    }

    const { password_encrypt, salt } = await securify.passwordCreate(new_password)

    return await db.query(`
        UPDATE
            ${dbDict.tableNames.client}
        SET
            password = $1,
            salt = $2
        WHERE
            username = $3
        `, [
            password_encrypt,
            salt,
            client_username
        ]
    )
    
}




const changePassword = async (client_id, old_password, new_password) => {

    let client = await (await clientService.findByKey('id', client_id)).rows[0]

    console.log(`(client.salt ${client.salt}) (client.password ${client.password})`)
    console.log(`await securify.passwordVerify(old_password, client.salt, client.password)`, await securify.passwordVerify(old_password, client.salt, client.password))

    if (!await securify.passwordVerify(old_password, client.salt, client.password)) {
        return 'old_password_invalid'
    } else if (await securify.passwordVerify(new_password, client.salt, client.password)) {
        return 'new_password_invalid'
    }

    const { password_encrypt, salt } = await securify.passwordCreate(new_password)

    return await db.query(`
        UPDATE
            ${dbDict.tableNames.client}
        SET
            password = $1,
            salt = $2
        WHERE
            id = $3
        `, [
            password_encrypt,
            salt,
            client_id
        ]
    )

}



module.exports = {
    createRequestAccount,
    verifySignIn,
    changePassword,
    forceChangePassword,
}