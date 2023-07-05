type tnxVal = {
    status: number|null,
    slug: string,
    name: string,
}

interface TnxDict {
    disapprove: tnxVal,
    appove: tnxVal,
    hold: tnxVal,
}

export const tnxDict: TnxDict = {
    disapprove: {
        status: -1,
        slug: 'disapprove',
        name: 'ไม่อนุมัติ',
    },
    appove: {
        status: 1,
        slug: 'appove',
        name: 'อนุมัติ',
    },
    hold: {
        status: null,
        slug: 'hold',
        name: 'รออนุมัติ',
    },
}


export const getTnxStateNameByStatusNum = (status: number|null): string => {
    switch (status) {
        case tnxDict.disapprove.status:
            return tnxDict.disapprove.name
        case tnxDict.appove.status:
            return tnxDict.appove.name
        case tnxDict.hold.status:
            return tnxDict.hold.name
        default:
            return 'unknow status'
    }
}