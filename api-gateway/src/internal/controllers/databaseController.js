const databaseService = require('./../services/databaseService')
const dataRoles = require('./../../data/dict/roles')



const clearDatabase = async (req, res) => {

    try {

        req.validate()
        // Verify access role
        if ([
            dataRoles.roles.guest.level,
            dataRoles.roles.member.level,
            dataRoles.roles.CEOs.level,
            dataRoles.roles.treasurer.level,
        ].includes(req.client.role)) { // return [1, 2, 3, 4, 5]
            return res.status(403).json({ 
                status: false, status_tag: 'warning', 
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้', data: null 
            })
        }

        const result = await databaseService.clearDatabase()
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดำเนินการเคลียข้อมูลเก่าในฐานข้อมูลเรียบร้อย',
            data: result.rows
        })

    } catch (err) { res.error(err) }

}



module.exports = {
    clearDatabase,
}
