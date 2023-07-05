//  null request member, 0 member, 1 admin, 2 chairman, 3 secretary, 4 treasurer, 5 CEOs

const roles = {
    guest: {
        slug: 'guest',
        name: 'ทั่วไป',
        level: null
    },
    member: {
        slug: 'member',
        name: 'สมาชิก',
        level: 0
    },
    admin: {
        slug: 'admin',
        name: 'ผู้ดูแล',
        level: 1
    },
    chairman: {
        slug: 'chairman',
        name: 'ประธาน',
        level: 2
    },
    secretary: {
        slug: 'secretary',
        name: 'เลขา',
        level: 3
    },
    treasurer: {
        slug: 'treasurer',
        name: 'เหรัญญิก',
        level: 4
    },
    CEOs: {
        slug: 'CEOs',
        name: 'ทีมบริหาร',
        level: 5
    }
}


const levels = Object.values(roles).map((item) => item.level)


module.exports = {
    roles,
    levels
}