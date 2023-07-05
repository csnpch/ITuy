const collegianService = require('./../services/collegianService')

const getSection = async (req, res) => {

    try {
    
        const sections = await (await collegianService.findAllSection()).rows
        
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: sections
        })
    
    } catch (err) { res.error(err) }

}


const getYearStd = async (req, res) => {

    try {

        const yearStds = await (await collegianService.findYearStd())
        
        return res.status(200).json({
            status: true,
            status_tag: 'success',
            message: 'ดึงข้อมูลสำเร็จ',
            data: yearStds
        })

    } catch (err) { res.error(err) }

}


module.exports = {
    getSection,
    getYearStd
}
