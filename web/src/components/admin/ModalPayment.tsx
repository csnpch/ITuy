import { useRouter } from 'next/router'
// Others
import { routes } from '@/data/dict/routes_dict'
import { Button } from '@mui/material'
import { Modal, message } from 'antd'
import { verifyRouter } from '@/utils/helpers/verifyRouter'
import { useState } from 'react'
import { roles } from '@/data/dict/role_dict'
import { PaymentDetectInterface } from '@/interfaces/payment'

import { moneyFormat, openMessageNoti } from '@/utils/helpers/functions'
import { paymentDict } from '@/data/dict/payment_dict'
import Link from 'next/link'
import configs from '@/configs'
import Moment from "react-moment"
import 'moment-timezone';


interface itemInterface {
    nameBill: string,
    price: number
}

interface propsModalAdminMenu {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    clientRole: number | null,
    dataPayment: PaymentDetectInterface[]
}
export default function ModalPayment({ 
    modalState,
    clientRole,
    dataPayment = []
}: propsModalAdminMenu) {

    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage()    // ant noti

    const accessStaff = clientRole === roles.admin.level
        || clientRole === roles.chairman.level
        || clientRole === roles.secretary.level
    const [toggleBtnStaff, setToggleBtnStaff] = useState<boolean>(false)
    const [listSelectPayment, setListSelectPayment] = useState<string[]>([])

    
    const handleNavigation = (path: string) => {
        setTimeout(() => {
            router.push(path)
        }, 600)
    }


    const handleNavigationPayment = (path: string) => {
    
        if (listSelectPayment.length === 0) {
            openMessageNoti(
                messageApi, 
                'warning',
                ` โปรดเลือกรายการที่ต้องการชำระก่อน`
            )
            return
        }

        setTimeout(() => {
            router.push({
                pathname: path,
                query: {
                    billIDs: listSelectPayment
                }
            })
        }, 600)
    
    }


    const handleChangeSelectPayment = (e: any, id: string) => {
        if (e.target.checked) {
            setListSelectPayment([...listSelectPayment, id])
        } else {
            setListSelectPayment(listSelectPayment.filter(item => item !== id))
        }
    }


    return (
        <>

            { contextHolder }

            {/* Modal */}
            <Modal 
                title='' 
                open={modalState.isOpen} 
                onCancel={() => {
                    modalState.setOpen(false)
                    setToggleBtnStaff(false)
                }}
                centered
                closable={false}
                footer={null}
                className={`my-4`}
            >
                <div className={`flex flex-col gap-y-3 pb-2`}>
                    <div className={`flex flex-col gap-y-3 font_kanit`}>

                        {
                            (!toggleBtnStaff && dataPayment.length > 0) &&
                            <div className={`w-full`}>
                                <div className={`w-full mt-2 text-center`}>
                                    <p className={`text-lg text-blue-700`}>
                                        คุณมีรายการเรียกเก็บเงินใหม่
                                    </p>
                                    <p className={`mt-1`}>
                                        ( โปรดเลือกรายการที่ต้องการชำระด้วยการจิ้มไปที่รายการ สามารถเลือกได้มากกว่า 1 รายการ )
                                    </p>
                                </div>
                                <p></p>
                                <div className={`w-full flex flex-col gap-y-2 my-4`}>
                                    {/* callback payment */}
                                    <div className='w-full flex flex-col gap-4'>
                                        {
                                            dataPayment.map((item, index) => {
                                                return (
                                                    <li className={`relative`}>

                                                        <input 
                                                            type='checkbox' 
                                                            id={`check${index}`} 
                                                            value={item.id} 
                                                            onChange={(e) => handleChangeSelectPayment(e, item.id)}
                                                            className='hidden peer absolute'
                                                        />

                                                        <label htmlFor={`check${index}`} className='
                                                            inline-flex flex-col items-center justify-between w-full 
                                                            p-5 cursor-pointer bg-gray-100 rounded-lg shadow-md
                                                            peer-checked:border-blue-600 peer-checked:bg-green-100
                                                        '>        
                                                            <div className={`w-full inline-flex items-center justify-between `}>
                                                                <div className={`w-full flex flex-col`}>
                                                                    <div className={`w-full flex flex-col gap-y-1`}>
                                                                        <p className={`
                                                                            tracking-wide text-blue-800
                                                                        `}>
                                                                            { item.title }
                                                                        </p>
                                                                        <p className={`text-xs text-black/60`}>
                                                                            <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                                                                {item.created_at_payment || 'invalid date'}
                                                                            </Moment>
                                                                        </p>
                                                                    </div>
                                                                    {
                                                                        item.description &&
                                                                        <div className={`w-full mt-4`}>
                                                                            <p className={``}>
                                                                                รายละเอียด
                                                                            </p>
                                                                            <div className={`w-full flex flex-col gap-y-1`}>
                                                                                <p className={`text-xs text-black/60`}>
                                                                                    { item.description }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>

                                                                <div className={`font_kanit flex gap-x-2 text-blue-800`}>
                                                                    <p>{ moneyFormat(item.amount) }</p>
                                                                    <p>฿</p>
                                                                </div>
                                                            </div>
                                                            
                                                            {
                                                                item.status_payment === paymentDict.callback.status && 
                                                                <p className='mt-3.5 -mb-2 text-red-700 text-center'>
                                                                    ( ถูกตีกลับ, หลักฐานไม่ถูกต้อง )
                                                                </p>
                                                            }
                                                        </label>

                                                        
                                                        {
                                                            item.status_payment === paymentDict.callback.status && 
                                                            <Link
                                                                href={`${configs.ITuy_API}${item.img_evidence}`} 
                                                                target='_blank'
                                                            >
                                                                <div 
                                                                    className='
                                                                        w-full bg-[#555] text-white text-center rounded-b-lg -mt-4 pt-6 pb-2 shadow-md
                                                                        tracking-wider cursor-pointer active:bg-[#444] duration-200 select-none
                                                                    '
                                                                >
                                                                    ดูหลักฐาน
                                                                </div>
                                                            </Link>
                                                        }
                                                    </li>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleNavigationPayment(routes.budget_payment.path)}
                                    variant='contained' 
                                    className={`
                                        w-full mt-2 py-3 font_kanit bg-[#7A03F1]
                                        tracking-wide font-normal text-lg
                                        ${listSelectPayment.length === 0 && `opacity-50 cursor-not-allowed`}
                                    `}
                                >
                                    ชำระเงิน
                                </Button>

                                <div className={`w-full py-[0.05rem] bg-black/40 mt-6 rounded-lg`} />

                            </div>
                        }

                        {
                            dataPayment.length === 0  &&
                            <p className={`w-full text-lg text-center text-blue-700`}>
                                ยังไม่มีรายการเรียกเก็บเงินใหม่
                            </p>
                        }
                        <div className={`w-full`}>
                            <Button
                                onClick={() => handleNavigation(routes.budget_my_history.path)}
                                variant='contained' 
                                className={`
                                    w-full mt-2.5 py-2 font_kanit bg-gray-600
                                    tracking-wide font-normal text-lg
                                `}
                            >
                                ดูประวัติการสมทบเงิน
                            </Button>
                        </div>
                        
                    </div>
                    {
                        verifyRouter(
                            routes.admin_budget_payment.routeProtectLevel, 
                            clientRole
                        ) && <>
                            {
                                !toggleBtnStaff &&
                                <Button
                                    onClick={() => setToggleBtnStaff(true)}
                                    variant='contained' 
                                    className={`
                                        w-full py-2 font_kanit mt-4
                                        tracking-wide font-normal text-lg
                                    `}
                                >
                                    เจ้าหน้าที่
                                </Button>
                            }
                            {
                                toggleBtnStaff &&
                                <div className={`w-full flex flex-col gap-y-3`}>
                                    <div className={`w-full text-lg mt-4 tracking-wide font_kanit flex justify-between`}>
                                        <span>สำหรับเจ้าหน้าที่</span>
                                        <span 
                                            onClick={() => setToggleBtnStaff(false)}
                                            className={`px-4 cursor-pointer`}
                                        >X</span>
                                    </div>
                                    <Button
                                        onClick={() => handleNavigation(routes.admin_budget_payment.path)}
                                        variant='contained' 
                                        className={`
                                            w-full py-3 font_kanit bg-green-700
                                            tracking-wide font-normal text-lg
                                        `}
                                    >
                                        ตรวจสอบการชำระเงิน
                                    </Button>
                                    
                                    <Button
                                        onClick={() => handleNavigation(routes.admin_budget_bill.path)}
                                        variant='contained' 
                                        className={`
                                            w-full py-3 font_kanit bg-blue-700
                                            tracking-wide font-normal text-lg
                                        `}
                                    >
                                        เรียกเก็บเงิน { accessStaff && `& อนุมัติ` }
                                    </Button>

                                    <Button
                                        onClick={() => handleNavigation(routes.admin_budget_payment_method.path)}
                                        variant='contained' 
                                        className={`
                                            w-full py-3 font_kanit bg-purple-800
                                            tracking-wide font-normal text-lg
                                        `}
                                    >
                                        ช่องทางชำระเงิน
                                    </Button>
                                    
                                    <Button
                                        onClick={() => handleNavigation(routes.admin_budget_transaction.path)}
                                        variant='contained' 
                                        className={`
                                            w-full py-3 font_kanit bg-rose-700
                                            tracking-wide font-normal text-lg
                                        `}
                                    >
                                        เบิกงบประมาณ
                                    </Button>
                                    
                                </div>
                            }
                        </>
                    }
                </div>
            </Modal>
        
        </>
    )
}