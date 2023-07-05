const clientService = require('./../services/clientService')
const dataRoles = require('./../../data/dict/roles')


const getClients = async (req, res) => {

    try {

        const role = req.client.role // data from verify token in session    

        if (!dataRoles.levels.filter(item => 
            item !== dataRoles.roles.guest.level &&
            ((item !== dataRoles.roles.member.level) || (req.params.id && true))
        ).includes(role)) {
            return res.status(403).json({
                status: false,
                status_tag: 'warning',
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้',
                data: null
            })
        }

        // If verify role pass
        if (req.params.id) {
            const result = await clientService.findById(req.params.id)
            return res.status(200).json({
                status: 'success',
                message: `Get data success`,
                data: result.rows[0]
            })
        }

        let { page, limit, yearStd, sectionStd } = req.query

        if (!page) page = 1
        if (!limit) limit = 5
        if (!yearStd || yearStd === 'all') yearStd = null
        if (!sectionStd || sectionStd === 'all') sectionStd = null

        const result = await clientService.findAll(page, limit, yearStd, sectionStd)
        return res.status(200).json({
            status: 'success',
            message: `Get data success`,
            data: result
        })
        
    } catch (err) { res.error(err) }
    
}


const getByTarget = async (req, res) => {

    try {

        const role = req.client.role // data from verify token in session    
   
        if (!dataRoles.levels.filter(item => 
            item !== dataRoles.roles.guest.level &&
            ((item !== dataRoles.roles.member.level) || (req.params.id && true))
        ).includes(role)) { // return [0, 1, 2, 3, 4, 5]
            return res.status(403).json({
                status: false,
                status_tag: 'warning',
                message: 'คุณไม่มีสิทธิดำเนินการกระทำนี้',
                data: null
            })
        }
        // If verify role pass
        const result = await clientService.findClientByTarget(req.params.target)
        return res.status(200).json({
            status: 'success',
            message: `Get data success`,
            data: result.rows
        })

    } catch (err) { res.error(err) }

}


const createClient = async (req, res) => {

    try {

        req.validate()

        const body = req.body
        await clientService.createClient(body)

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'สมัครสมาชิกสำเร็จ',
            data: {
                username: body.username,
                fullname: body.fullname,
                branch: body.branch,
                role: body.role
            }
        }) 

    } catch (err) { res.error(err) }

}


const addStartedInfo = async (req, res) => {
    
    try {

        req.validate()
        
        const body = req.body
        const client = await clientService.setStartedInfo(req.client.id, body.nickname, body.fullname)

        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'บันทึกข้อมูลสำเร็จ',
            data: {
                client: client
            }
        })

    } catch (err) { res.error(err) }

}


module.exports = {
    getClients,
    getByTarget,
    createClient,
    addStartedInfo
}
