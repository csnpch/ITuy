import { useEffect, useState } from "react"
// Datas
import { routes } from "@/data/dict/routes_dict"
// Libs
import CountUp from 'react-countup'
// Components
import TransitionBox from "@/components/budget/TransactionBox"
import LayoutMain from "@/components/layouts/main"
import { PaymentDetectInterface } from "@/interfaces/payment"
import { PaymentServices } from "@/services/api/payment"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { timerSwal } from "@/utils/sweetAlert"
import { paymentDict } from "@/data/dict/payment_dict"
import ModalViewSlip from "@/components/budget/payment/ModalViewSlip"
import Moment from "react-moment"
import 'moment-timezone';
import { getAccessToken } from "@/store/slices/authSlice"


export default function BudgetMyHistory() {

    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const [loading, setLoading] = useState<boolean>(true)
    const [myPayment, setMyPayment] = useState<PaymentDetectInterface[]|null>([])
    const [sumAmountPaid, setSumAmountPaid] = useState<number>(0)
    const [itemPayment, setItemPayment] = useState<PaymentDetectInterface|null>(null)
    const [modalStateViewSlip, setModalStateViewSlip] = useState<boolean>(false)

    const detectPayment = async () => {
    
        await PaymentServices.findMyPayment(accessToken)
            .then((res: any) => {
                setMyPayment(res.data.data.items)
                setSumAmountPaid(res.data.data.sum)
                setLoading(false)
            })
            .catch((err: any) => {
                console.log(err)
                timerSwal({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    subTitle: 'ไม่สามารถดึงข้อมูลการชำระเงินได้',
                    timer: 1500,
                })
            })

    }


    const handleClickItemMyPayment = (item: PaymentDetectInterface) => {
        setItemPayment(item)
        setModalStateViewSlip(true)
    }


    useEffect(() => {

        detectPayment()
    
    }, [])


    return (
        <>
            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.budget}
                currentRoute={routes.budget_my_history}
            >

                <ModalViewSlip 
                    modalState={{
                        isOpen: modalStateViewSlip,
                        setOpen: setModalStateViewSlip
                    }}
                    payment={itemPayment}
                />


                {
                    loading 
                    ?
                    <>Loading...</>
                    :
                    <>
                        
                        {/* Report */}
                        <div className={`
                            z-0 w-full h-20 rounded-b-[2.8rem] bg-soft-primary shadow-[0_4px_4px_rgba(0,0,0,0.3)]
                            text-white flex flex-row justify-center items-center gap-x-6 text-xl
                        `}>
                            <p className={`font-light tracking-wide`}>
                                เงินสบทบของคุณ
                            </p>
                            <div className={`h-6 flex justify-center items-center gap-x-1`}>
                                <span className={`select-none`}>฿</span>
                                <span className={`text-2xl tracking-wider`}>
                                    <CountUp
                                        decimals={2}
                                        end={sumAmountPaid || 0}
                                        duration={1}
                                    />
                                </span>
                            </div>
                        </div>

                        {/* Container content */}
                        {/* Content */}
                        <div className={`
                            min-h-[4rem] wh-full bg-base
                            space-horizontal-secondary
                        `}>
                            
                            {/* Transition container */}
                            <div className={`
                                w-full flex flex-col mt-8 gap-y-2
                                _pb-16
                                pb-28
                            `}>
                                
                                {/* Title */}
                                <span className={`ml-0.5`}>
                                    ประวัติการชำระเงินสบทบทุน
                                </span>

                                {/* Container transition */}
                                <div className={`mt-1.5 flex flex-col p-4 py-2 wh-full bg-white shadow-md rounded-lg`}>
                                
                                    {/* Rows */}
                                    {
                                        myPayment && 
                                        myPayment.map((item, index) => {
                                            if (
                                                item.status_payment !== paymentDict.paid.status 
                                                && item.status_payment !== paymentDict.hold_check.status    
                                            ) return null

                                            return (
                                                <TransitionBox 
                                                    key={index}
                                                    classAmount={`text-[1.06rem]`}
                                                    classNameTitle={`text-[#423C74]`}
                                                    title={item.title}
                                                    subTitle={
                                                        <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                                            {item.updated_at_payment || 'invalid date'}
                                                        </Moment>
                                                    }
                                                    textStatusTnx={`${
                                                        item.status_payment === paymentDict.hold_check.status
                                                        ? '( รอการตรวจสอบ )' : ''
                                                    }`}
                                                    classStatusTnx="text-blue-600"
                                                    amount={item.amount || 0}
                                                    statusTnx={item.status_payment || 0}
                                                    bottomLine={index < myPayment.length - 1}
                                                    onClick={() => handleClickItemMyPayment(item)}
                                                />
                                            )
                                        })
                                    }
                                    
                                    {/* check status paid only  */}
                                    {
                                        myPayment &&
                                        myPayment.filter((item) => 
                                            item.status_payment === paymentDict.paid.status 
                                            || item.status_payment === paymentDict.hold_check.status
                                        ).length === 0 &&
                                        <div className={`flex flex-col items-center justify-center`}>
                                            <span className={`py-4 text-base text-gray-400 text-sm`}>
                                                - ไม่พบประวัติการชำระเงิน -
                                            </span>
                                        </div>
                                    }

                                </div>

                            </div>

                        </div>

                    </>
                }
                
            </LayoutMain>
        </>
    )
}