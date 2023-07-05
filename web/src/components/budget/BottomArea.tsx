import { useEffect, useState } from "react"


// Components
import TransectionCallbackRow from "./TransactionCallbackRow"
import TransectionCallbackTitle from "./TransactionCallbackTitle"
import ModalChooseTnxPay from "./payment/ModalChooseTnxPay"
// Icons
import { IoIosArrowUp } from 'react-icons/io'
import { AiOutlineHistory } from 'react-icons/ai'
import Link from "next/link"
import { routes } from "@/data/dict/routes_dict"
import { useRouter } from "next/router"


interface itemInterface {
    nameBill: string,
    price: number
}


interface mapTitleInterface {
    key: string,
    title: string,
    titleCenter?: boolean,
    bracketText?: string,
    totalAmount?: number,
    className?: string,
    classTitle?: string,
    classBracketText?: string,
    classTotalAmount?: string,
    active: boolean,
    items?: itemInterface[],
}


interface propsInterface {
    navigator_href?: string,
    show: boolean,
    success: boolean, // ชำระทั้งหมดแล้ว
    successSomeTNX: itemInterface[], // ชำระบางส่วน มีบางส่วนยังไม่ชำระ
    hold: itemInterface[], // รอชำระ
    notPass: itemInterface[], // ไม่ผ่านการชำระ
    overdue: itemInterface[], // ค้างชำระ
    className?: string,
    classNameContent?: string,
    textBtn?: string,
    showHistoryBtn?: boolean
}

export default function BottomArea({
    navigator_href = '',
    show = false,
    success = false, 
    successSomeTNX,
    hold,
    notPass,
    overdue,
    className = '',
    classNameContent = '',
    textBtn = '',
    showHistoryBtn = false
}: propsInterface) {

    const router = useRouter()

    const [overdueIndex, setOverdueIndex] = useState<number>(-1)
    const [statusToggleCallback, setStatusToggleCallback] = useState<boolean>(false)
    const [countCallbackActive, setCountCallbackActive] = useState<number>(0)
    const [statusChooseTnx, setStatusChooseTnx] = useState<boolean>(false)
    const [callbackData, setCallbackData] = useState<mapTitleInterface[]>([
        {
            key: 'success',
            title: 'คุณได้ชำระเงินทั้งหมดแล้ว', 
            titleCenter: true,
            className: 'block text-center',
            classTitle: 'text-[0.8rem] text-[#299C00]',
            active: success,
        },
        {
            key: 'successSomeTNX',
            title: 'การชำระนี้ได้ผ่านการตรวจสอบแล้ว', 
            classTitle: 'text-[0.8rem] text-[#299C00]',
            active: successSomeTNX.length > 0,
            items: successSomeTNX
        },
        {
            key: 'hold',
            title: 'กำลังตรวจสอบการการชำระเงิน',
            classTitle: 'text-[0.8rem] text-[#DF6B00]',
            active: hold.length > 0,
            items: hold
        },
        {
            key: 'notPass',
            title: 'ไม่ผ่านการตรวจสอบ',
            bracketText: 'จิ้มเพื่อดูรายละเอียด',
            classTitle: 'text-[0.8rem] text-[#FF0000]',
            classBracketText: 'text-black text-xs',
            active: notPass.length > 0,
            items: notPass
        },
        {
            key: 'overdue',
            title: 'ยอดที่ต้องสมทบ',
            bracketText: 'ค้างชำระ',
            classTitle: 'text-[0.9rem]',
            classBracketText: 'text-[#FF3D00]',
            classTotalAmount: 'text-[#FF3D00]',
            totalAmount: 0.00,
            active: overdue.length > 0,
            items: overdue
        }
    ])
    
    
    useEffect(() => {

        let tmpCountCallbackActive = 0;
        callbackData.forEach(item => {
            if (item.active) {
                tmpCountCallbackActive++;
            }
        })
        setCountCallbackActive(tmpCountCallbackActive)
        setOverdueIndex(callbackData.findIndex(item => item.key === 'overdue'))

        if (overdueIndex === -1) return
        calcTotalOverdueAmount(overdueIndex)

    }, [])


    const calcTotalOverdueAmount = (overdueIndex: number) => {
        let tmpTotal = 0.00;
        overdue.forEach((item) => {
            tmpTotal += item.price
        })
        if (overdueIndex === -1) return

        const newCallbackData = [...callbackData]
        newCallbackData[overdueIndex] = {
            ...newCallbackData[overdueIndex],
            totalAmount: tmpTotal
        }
        setCallbackData(newCallbackData)
    }


    const handleClick = () => {

        router.push(
            navigator_href || (
                !callbackData[overdueIndex]?.active 
                ? routes.budget_my_history.path : '#'
            )
        )
        
        if (!callbackData[overdueIndex]?.active) return
        setStatusChooseTnx(true)

    }

    
    return (
        <>

            {/* Modals */}
            <ModalChooseTnxPay 
                TNXitems={overdue}
                statusChooseTnx={{
                    isOpen: statusChooseTnx,
                    setOpen: setStatusChooseTnx
                }}
            />


            <div className={`
                    fixed wh-full left-0 bottom-0 
                    flex justify-center
                    ${className}
            `}>

                <div
                    onClick={handleClick}
                    className={`
                        w-full h-full shadow-[0_-2px_4px_rgba(0,0,0,0.2)]
                        ${classNameContent}
                    `}
                >

                    {/* Transection callbacks */}    
                    {
                        (show && countCallbackActive > 0) &&
                        <div className={`
                            w-full px-7 bg-white 
                            ${
                                !statusToggleCallback && 
                                `   
                                pt-4
                                ${!success && 'pb-6'} 
                                `
                            }
                        `}>

                            {/* Button toggle callback area */}
                            {
                                !success && 
                                <div 
                                className={`
                                w-full flex justify-center cursor-pointer
                                ${statusToggleCallback ? 'py-2' : 'pb-4'}
                                `}
                                onClick={() => {
                                    setStatusToggleCallback(!statusToggleCallback)
                                }} 
                                >
                                    <IoIosArrowUp 
                                        className={`
                                        duration-500 text-blue-700 
                                        ${statusToggleCallback 
                                            ? 'animate-arrowUpRotateToZero'
                                            : 'animate-rotate180'
                                        }
                                        `}
                                        // style={{
                                            //     transform: `rotate(${statusToggleCallback ? 0 : 180}deg)` 
                                            // }}
                                            />
                                </div>
                            }
                            
                            {/* callback payment */}
                            <div 
                                className={`
                                    w-full flex flex-col gap-y-5 
                                    ${statusToggleCallback && 'hidden'}
                                `}
                            >
                                {
                                    callbackData.map((callback, index) => {
                                        return (
                                            <>
                                                {
                                                    callback.active &&
                                                    <>
                                                        <div key={index} className="w-full flex flex-col gap-y-3">
                                                            {/* Title callback */}
                                                            { 
                                                                <TransectionCallbackTitle 
                                                                    title={callback.title}
                                                                    titleCenter={callback.titleCenter}
                                                                    totalAmount={`${callback.totalAmount || ''}`}
                                                                    className={callback.className || ''}
                                                                    classNameTitle={callback.classTitle || ''}
                                                                    bracketText={callback.bracketText || ''}
                                                                    classBrackerText={callback.classBracketText || ''}
                                                                    classNameTotalAmount={callback.classTotalAmount || ''}
                                                                />
                                                            }
                                                        
                                                            {/* Item callback row */}
                                                            <div className={`w-full flex flex-col gap-y-2 text-xs`}>
                                                                {
                                                                    callback.items?.map((item, index) => {
                                                                        return (
                                                                            <TransectionCallbackRow
                                                                                key={index}
                                                                                title={item.nameBill}
                                                                                price={`${item.price}`}
                                                                            />
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            (!success && index < countCallbackActive) &&
                                                            <div className={`py-[0.04rem] w-full bg-[#BFBFBF]`} />
                                                        }
                                                    </>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    }

                    {/* Base button */}
                    <div
                        className={`
                            wh-full group py-3 text-center text-white text-sm select-none
                            bg-gradient-to-r cursor-pointer flex-center
                            from-[#1A548E] to-[#153456]
                            `}
                            // old
                        // from-[#4B3EB9] to-[#2E2A50]
                    >
                        <p className={`text-lg duration-200 group-active:ml-2 tracking-wider`}>
                            {
                                !textBtn ?
                                callbackData[overdueIndex]?.active ? `ชำระเงิน` : `ดูประวัติการสมทบเงิน`
                                : textBtn
                            }
                        </p>
                    </div>

                </div>

            </div>

            
            {/* Icon History */}
            {
                showHistoryBtn && 
                <Link 
                    href={routes.budget_my_history.path}
                    className={`
                        fixed text-lg py-4 px-6 bottom-0 right-0 
                        flex-center cursor-pointer 
                        active:right-1 duration-100
                    `}
                >
                    <AiOutlineHistory 
                        className={`text-2xl text-white`}
                    />
                </Link>
            }
                            
        </>
    )

}