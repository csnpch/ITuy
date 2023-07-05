//  null request member, 0 member, 1 admin, 2 chairman, 3 secretary, 4 treasurer, 5 CEOs

export interface BillStatusInterface {
    slug: string,
    name: string,
    status: number|null
}

export interface BillDictInterface {
    hold: BillStatusInterface,
    appove: BillStatusInterface,
    cancel: BillStatusInterface,
    close: BillStatusInterface,
}


export const billDict: BillDictInterface = {

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
        name: 'ปิดบิลเรียกเก็บเงิน',
        status: 0
    }

}


export const getBillStageNameByStatusNum = (status: number|null) => {
    switch (status) {
        case billDict.hold.status:
            return billDict.hold.name
        case billDict.appove.status:
            return billDict.appove.name
        case billDict.cancel.status:
            return billDict.cancel.name
        case billDict.close.status:
            return billDict.close.name
        default:
            return null
    }
}