const payment_method_status = {
    active: {
        slug: 'normal',
        name: 'ปกติ',
        status: null
    },
    disable: {
        slug: 'disable',
        name: 'ปิดใช้งาน',
        status: -1
    },
    primary: {
        slug: 'primary',
        name: 'ช่องทางชำระเงินหลัก',
        status: 1
    }
}



module.exports = {
    ...payment_method_status
}