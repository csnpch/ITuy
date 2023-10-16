import { GrHomeRounded } from 'react-icons/gr'
import { HiOutlineLockClosed } from 'react-icons/hi'
import { IoWalletOutline, IoDocumentTextOutline } from 'react-icons/io5'
import { SlLocationPin } from 'react-icons/sl'
import { BsDiagram3 } from 'react-icons/bs'
import { dataRoutesInterface } from '@/interfaces/routes'
import { levels, roles } from './role_dict'
import { MdOutlineManageAccounts } from 'react-icons/md'


interface routesInterface {
    home: dataRoutesInterface,
    auth: dataRoutesInterface,
    budget: dataRoutesInterface,
    budget_payment: dataRoutesInterface,
    budget_my_history: dataRoutesInterface,
    location: dataRoutesInterface,
    board: dataRoutesInterface,
    document: dataRoutesInterface,
    // Section admin
    admin_budget_payment: dataRoutesInterface,
    admin_budget_payment_validation: dataRoutesInterface,
    admin_budget_bill: dataRoutesInterface,
    admin_budget_payment_method: dataRoutesInterface,
    admin_budget_transaction: dataRoutesInterface,
    admin_client: dataRoutesInterface,
}


export const routes: routesInterface = {

    home: {
        title: { 
            en: 'Home', 
            th: 'หน้าหลัก' 
        },
        slug: `home`,
        path: `/`,
        icon: (className) => (<GrHomeRounded className={`${className}`} />),
        routeProtectLevel: levels,
        statusActive: true,
        statusShowOnSidebar: true,
    },
    auth: {
        title: { 
            en: 'Authentication', 
            th: 'เข้าสู่ระบบ / ยืนยันตัวตน' 
        },
        slug: `auth`,
        path: `/auth`,
        icon: (className) => (<HiOutlineLockClosed className={`${className}`} />),
        routeProtectLevel: levels,
        statusActive: true,
        statusShowOnSidebar: true,
    },
    budget: {
        title: {
            th: `มาใช้เงินแก้ปัญหากันเถอะ`,
            en: `Let's use money to solve problems`
        },
        titleShow: 'งบประมาณ',
        slug: `budget`,
        path: `/budget`,
        icon: (className) => (<IoWalletOutline className={`${className}`} />),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
        ),
        statusActive: true,
        statusShowOnSidebar: true
    },
    budget_payment: {
        title: { th: ``, en: `` },
        titleShow: 'ชำระเงิน',
        slug: 'budget_payment',
        path: `/budget/payment`,
        icon: () => (<></>),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
        ),
        statusActive: true
    },
    budget_my_history: {
        title: { th: ``, en: `` },
        titleShow: 'ประวัติการสมทบเงิน',
        slug: 'budget_my_history',
        path: `/budget/my/history`,
        icon: () => (<></>),
        routeProtectLevel: levels.filter((item: number | null) =>
            item !== roles.guest.level
        ),
        statusActive: true,
    },
    location: {
        title: {
            th: `สถานที่แนะนำใกล้มอ`,
            en: `Recommended spots near Univ`
        },
        slug: `location`,
        path: 'https://ituy-location.pages.dev',
        icon: (className) => (<SlLocationPin className={`${className}`} />),
        routeProtectLevel: false,
        statusActive: true,
        statusShowOnSidebar: true
    },
    board: {
        title: {
            th: `บอร์ดทีมบริหาร & นโยบาย`,
            en: `Management team & Policy board`
        },
        slug: `board`,
        path: `/board`,
        icon: (className) => (<BsDiagram3 className={`${className}`} />),
        routeProtectLevel: levels.filter((item: number | null) =>
            item !== roles.guest.level
        ),
        statusActive: false,
        statusShowOnSidebar: true
    },
    document: {
        title: {
            th: `ชีทเรียนต่าง ๆ`,
            en: `Various study sheets`
        },
        slug: `document`,
        path: `/document`,
        icon: (className) => (<IoDocumentTextOutline className={`${className}`} />),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
        ),
        statusActive: false,
        statusShowOnSidebar: true
    },
    // Admin
    admin_budget_payment: {
        title: { th: ``, en: `` },
        titleShow: `ตรวจสอบการชำระเงิน`,
        slug: `admin_budget_payment`,
        path: `/admin/budget/payment/`,
        icon: (_) => (<></>),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
            && item !== roles.member.level
            && item !== roles.CEOs.level
        ),
        statusActive: true,
        statusShowOnSidebar: false
    },
    admin_budget_payment_validation: {
        title: { th: ``, en: `` },
        titleShow: `ตรวจสอบการชำระเงิน`,
        slug: `admin_budget_payment_validation`,
        path: `/admin/budget/payment/validation`,
        icon: (_) => (<></>),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
            && item !== roles.member.level
            && item !== roles.CEOs.level
        ),
        statusActive: true,
        statusShowOnSidebar: false
    },
    admin_budget_payment_method: {
        title: { th: ``, en: `` },
        titleShow: `ช่องทางชำระเงิน`,
        slug: `admin_budget_payment_method`,
        path: `/admin/budget/payment/method`,
        icon: (_) => (<></>),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
            && item !== roles.member.level
            && item !== roles.CEOs.level
        ),
        statusActive: true,
        statusShowOnSidebar: false
    },
    admin_budget_bill: {
        title: { th: ``, en: `` },
        titleShow: `เรียกเก็บเงิน`,
        slug: `admin_budget_bill`,
        path: `/admin/budget/bill`,
        icon: (_) => (<></>),
        routeProtectLevel: levels.filter((item: number | null) => 
            item !== roles.guest.level
            && item !== roles.member.level
            && item !== roles.CEOs.level
        ),
        statusActive: true,
        statusShowOnSidebar: false
    },
    admin_budget_transaction: {
        title: { th: ``, en: `` },
        titleShow: 'เบิกงบประมาณ',
        slug: 'budget_transaction',
        path: `/admin/budget/transaction`,
        icon: () => (<></>),
        routeProtectLevel: levels.filter((item: number | null) =>
            item !== roles.guest.level
            && item !== roles.member.level
            && item !== roles.CEOs.level
        ),
        statusActive: true,
    },
    admin_client: {
        title: { th: `จัดการผู้ใช้งาน`, en: `` },
        titleShow: `จัดการผู้ใช้งาน`,
        slug: `admin_client`,
        path: `/admin/client`,
        icon: (className) => (<MdOutlineManageAccounts className={`${className}`} />),
        routeProtectLevel: levels.filter((item: number | null) =>
            item !== roles.guest.level
            && item !== roles.member.level
        ),
        statusActive: true,
        statusShowOnSidebar: true,
        staffOnly: true,
    }
}


export const ignoreProtectRoutes = [
    routes.home.path,
    routes.auth.path,
]

// console.log('routes', routes)