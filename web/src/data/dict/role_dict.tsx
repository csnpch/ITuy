//  null request member, 0 member, 1 admin, 2 chairman, 3 secretary, 4 treasurer, 5 CEOs

export interface roleInterface {
    slug: string,
    name: string,
    level: number|null
}

interface rolesInterface {
    guest: roleInterface,
    member: roleInterface,
    admin: roleInterface,
    chairman: roleInterface,
    secretary: roleInterface,
    treasurer: roleInterface,
    CEOs: roleInterface,
}


export const roles: rolesInterface = {

    guest: {
        slug: 'guest',
        name: 'ผู้เยี่ยมชม',
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


export const levels: (number|null)[]  = Object.values(roles).map((item) => item.level)


export const getRoleNameByStatus = (status: number|null|undefined): string => {
    switch (status) {
        case roles.guest.level:
            return roles.guest.name
        case roles.member.level:
            return roles.member.name
        case roles.admin.level:
            return roles.admin.name
        case roles.chairman.level:
            return roles.chairman.name
        case roles.secretary.level:
            return roles.secretary.name
        case roles.treasurer.level:
            return roles.treasurer.name
        case roles.CEOs.level:
            return roles.CEOs.name
        default:
            return 'unknow your role'
    }
}

// console.log('levels', levels)