const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('./../configs')


const passwordHash = async (password, salt = '') => {
    return crypto.createHash('sha256').update(password + salt).digest('hex')
}


const passwordCreate = async (password) => {
    const salt = crypto.randomBytes(16).toString('hex') 
    const password_encrypt = await passwordHash(password, salt)
    
    return {
        password_encrypt,
        salt
    }
}


const passwordVerify = async (password, salt, password_hash) => {
    return await passwordHash(password, salt) === password_hash
}

// Example use
// router.delete('/:id', verifyRoles(['admin, staff']), ...
const verifyRoles = (roles = []) => {
    return (req, res, next) => {
        try {
            if (roles.indexOf(req.session.userLogin.u_role) >= 0)
                return next()
            res.error({ msg: `Forbidden` })
        }
        catch (ex) { res.status(403).json({ message: ex.message }) }
    }
}



const createJWToken = async (client) => {

    if (client.username === undefined) {
        throw new Error("Can't create JWTtoken")
    }

    return jwt.sign(
        {
            id: client.id,
            username: client.username, 
            email: client.email,
            role: client.role
        }, 
        config.env.JWT_SECRET,
        { 
            expiresIn: '1d'
            // expiresIn: config.env.JWT_EXPIRES_IN
        }
    )

}


const verifyToken = (req, res, next) => {
    try {
        let token = req.headers['authorization'] || req.body.accessToken
        if (token.includes(`Bearer`)) {
            token = token.split(' ')[1]
        }

        if (!token) {
            return res.status(403).json({ 
                msg: "Access not allowed, Token is required",
                message: "ไม่อนุญาตให้เข้าถึง, ต้องการโทเค็นการเข้าถึง (ไม่พบโทเค็น)", 
                statusState: 'token_not_allowed' 
            })
        }

        try {
            const decoded = jwt.verify(token, config.env.JWT_SECRET)
            req.client = decoded
            next()
        } catch(err) {
            return res.status(401).json({ 
                msg: "Invalid Access Token or Token is Expired",
                message: 'โทเค็นการเข้าถึงไม่ถูกต้อง หรือ โทเค็นการเข้าถึงหมดอายุ',
                statusState: 'token_expired' 
            })
        }
        
    } catch (err) { 
        res.status(500).json({ 
            msg: "Can't verify token",
            message: "เกิดข้อผิดพลาด, ไม่สามารถตรวจสอบโทเคนได้",
            statusState: 'cant_verify' 
        })
    }
}


module.exports = {
    passwordHash,
    passwordCreate,
    passwordVerify,
    verifyRoles,
    createJWToken,
    verifyToken
}
