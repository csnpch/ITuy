// status
const bill_status = {
    hold: {
        slug: 'hold',
        name: 'รออนุมัติบิล',
        status: null
    },
    appove: {
        slug: 'appove',
        name: 'อนุมัติใช้งานบิล',
        status: 1
    },
    cancel: {
        slug: 'cancel',
        name: 'ยกเลิกบิล',
        status: -1
    },
    close: {
        slug: 'close',
        name: 'ปิดบิล',
        status: 0
    }
}



module.exports = {
    ...bill_status
}