export interface valuePaymentDictInterface {
    slug: string,
    name: string,
    status: number|null
}


export interface paymentDictInterface {
    paid: valuePaymentDictInterface,
    hold_check: valuePaymentDictInterface,
    hold: valuePaymentDictInterface,
    callback: valuePaymentDictInterface
}


export const paymentDict: paymentDictInterface = {
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
        name: 'ถูกส่งกลับ',
        status: 0
    }
}


// Payment Method

export interface paymentMethodInterface {
    slug: string,
    name: string,
    status: number|null
}

export interface paymentMethodObjectInterface {
    normal: paymentMethodInterface,
    disable: paymentMethodInterface,
    primary: paymentMethodInterface,
}


export const paymentMethodDict: paymentMethodObjectInterface = {

    normal: {
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


export const getPaymentStageNameByStatusNum = (status: number|null) => {
    switch (status) {
        case paymentDict.hold.status:
            return paymentDict.hold.name
        case paymentDict.hold_check.status:
            return paymentDict.hold_check.name
        case paymentDict.paid.status:
            return paymentDict.paid.name
        case paymentDict.callback.status:
            return paymentDict.callback.name
        default:
            return 'สถานะที่ไม่รู้จัก'
    }
}