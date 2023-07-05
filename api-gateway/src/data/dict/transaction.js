// status
const tnx_status = {
    hold: {
        slug: 'hold',
        name: 'รออนุมัติงบประมาณ',
        status: null
    },
    appove: {
        slug: 'appove',
        name: 'อนุมัติงบประมาณ',
        status: 1
    },
    disapproval: {
        slug: 'cancel',
        name: 'ไม่อนุมัติงบประมาณ',
        status: -1
    },
}



module.exports = {
    ...tnx_status
}