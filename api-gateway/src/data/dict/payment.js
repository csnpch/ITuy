// status
const payment_status = {
    paid: {
        slug: 'paid',
        name: 'ชำระแล้ว',
        status: 1
    },
    hold_check: {
        slug: 'hold_check',
        name: 'รอตรวจสอบ',
        status: 2
    },
    hold: {
        slug: 'hold',
        name: 'รอชำระ',
        status: null
    },
    callback: {
        slug: 'cancel',
        name: 'ส่งกลับ',
        status: 0
    }
}



module.exports = {
    ...payment_status
}