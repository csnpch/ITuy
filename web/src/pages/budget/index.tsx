import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
// Datas
import { routes } from '@/data/dict/routes_dict'
import { descriptions } from '@/data/string'
// Store
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getDataClient } from '@/store/slices/clientSlice'
// Libs
import CountUp from 'react-countup'
// Components
import FloatingBtnPayment from '@/components/budget/payment/FloatingBtnPayment'
import ModalPaymentMenu from '@/components/admin/ModalPayment'
import TransitionBox from '@/components/budget/TransactionBox'
import LayoutMain from '@/components/layouts/main'
import { PaymentDetectInterface } from '@/interfaces/payment'
import { PaymentServices } from '@/services/api/payment'
import { paymentDict } from '@/data/dict/payment_dict'
import { timerSwal } from '@/utils/sweetAlert'
import { TnxServices } from '@/services/api/transaction'
import { transactionInterface } from '@/interfaces/transaction'
import Moment from 'react-moment'
import 'moment-timezone'
import ModalViewTnx from '@/components/budget/ModalViewTnx'
import { moneyFormat } from '@/utils/helpers/functions'



export default function Budget() {

    const router = useRouter()
    
    // stores
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)
    // states
    const [modalPaymentMenu, setModalPaymentMenu] = useState<boolean>(false)
    const [dataPayment, setDataPayment] = useState<PaymentDetectInterface[]>([])
    const [sumMyPayment, setSumMyPayment] = useState<number>(0)
    const [dataTnx, setDataTnx] = useState<transactionInterface[]>([])
    const [modalViewTnx, setModalViewTnx] = useState<boolean>(false)
    const [transactionView, setTransactionView] = useState<transactionInterface|null>(null)
    const [realBudget, setRealBudget] = useState<number>(0)

    const detectPayment = async () => {
    
        await PaymentServices.findMyPayment(accessToken)
            .then((res: any) => {
                const resDataPayment = res.data.data.items
                setSumMyPayment(res.data.data.sum)
                setDataPayment(
                    resDataPayment.filter((item: PaymentDetectInterface) => {
                        return item.status_payment === paymentDict.callback.status 
                            || item.status_payment === paymentDict.hold.status 
                    })
                )
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

    const fetchTnxAndBudget = async () => {
        try {
            const res: any = await TnxServices.getTnxApprove(accessToken, 1)
            setDataTnx(res.data.transactions)
            const resRealBudget: any = await PaymentServices.getRealBudget(accessToken)
            setRealBudget(resRealBudget.data)
        } catch (_: any) {
            timerSwal({
                title: `เกิดข้อผิดพลาด`,
                subTitle: `ไม่สามารถดึงข้อมูลธุรกรรมได้ในขณะนี้`,
                icon: `error`,
            })
        }
    }


    const handleClickViewTnx = (transaction: transactionInterface) => {
        setTransactionView(transaction)
        setModalViewTnx(true)
    }


    // For router
    useEffect(() => {
        if (router.query.sendBack) {
            router.push(router.query.sendBack.toString())
        }

        detectPayment()
        fetchTnxAndBudget()
    }, [])
    

    return (
        <>

            <ModalPaymentMenu
                clientRole={dataClient?.role || null}
                modalState={{
                    isOpen: modalPaymentMenu,
                    setOpen: setModalPaymentMenu
                }}
                dataPayment={dataPayment}
            />


            <ModalViewTnx
                modalState={{
                    isOpen: modalViewTnx,
                    setOpen: setModalViewTnx
                }}
                transaction={transactionView}
            />


            <FloatingBtnPayment 
                openTooltip={dataPayment.length > 0 && !modalPaymentMenu}
                triggerState={{
                    valueIs: modalPaymentMenu,
                    setValue: setModalPaymentMenu
                }}
                tooltipText={
                    dataPayment
                        ? `มีรายการชำระเงิน ${dataPayment.length} รายการ`
                        : `ไม่มีรายการชำระเงิน`
                }
                className={`bottom-[2rem`}
            />


            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.home}
                currentRoute={routes.budget}
            >

                <div className={`w-full 2xl:w-4/12 xl:w-6/12 mx-auto`}>

                    {/* Report */}
                    <div className={`
                        z-0 w-full h-28 rounded-bl-[2.8rem] bg-soft-primary
                        text-white flex flex-row justify-center gap-x-6 items-center
                    `}>
                        <div className={`flex flex-col gap-y-2.5`}>
                            <p className={`font-light tracking-wider text-[1.08rem]`}>
                                งบประมาณสาขา
                            </p>
                            <div className={`h-6 flex justify-center items-center gap-x-1`}>
                                <span className={`mt-1 select-none text-lg`}>฿</span>
                                <span className={`text-[1.4rem] tracking-wider`}>
                                    <CountUp
                                        decimals={2}
                                        end={realBudget}
                                        duration={2}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className={`h-4/6 bg-white/60 w-[0.12rem] rounded-full`} />
                        <div className={`flex flex-col gap-y-2.5`}>
                            <p className={`font-light tracking-wider text-[1.08rem]`}>
                                เงินสบทบของคุณ
                            </p>
                            <div className={`h-6 flex justify-center items-center gap-x-1`}>
                                <span className={`mt-1 select-none text-lg`}>฿</span>
                                <span className={`text-[1.4rem] tracking-wider`}>
                                    <CountUp
                                        end={sumMyPayment}
                                        duration={1}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* Container content */}
                    <div className={`
                        relative min-h-[4rem] w-full
                    `}>
                        
                        {/* Background */}
                        <div className={`
                            absolute top-0 left-0 wh-full
                            bg-soft-primary
                        `} />

                        {/* Content */}
                        <div className={`
                            absolute top-0 left-0 wh-full
                            bg-base rounded-tr-[2.8rem]
                            pt-6 space-horizontal-secondary
                        `}>
                            
                            {/* Title & Description */}
                            <div className={`flex flex-col gap-y-1.5`}>

                                <p className={`text-lg text-black font-medium tracking-wide select-none`}>
                                    มาใช้เงินแก้ปัญหากันเถอะ
                                </p>
                                <p className={`text-xs leading-[1.2rem] text-secondary-text`}>
                                    {descriptions.budget}
                                </p>

                            </div>

                            {/* Transition container */}
                            <div className={`
                                w-full flex flex-col mt-6 gap-y-2
                                _pb-16 pb-32
                            `}>
                                
                                <div className={`w-full flex flex-row justify-between items-end select-none`}>
                                    <span className={`ml-0.5`}>
                                        ธุรกรรมสาขา
                                    </span>
                                    {
                                        dataTnx.length > 0 &&
                                        <span className={`
                                            mr-0.5 underline text-secondary-text text-xs tracking-wide
                                            cursor-pointer active:text-black active:mr-1.5 duration-200
                                        `}>
                                            จิ้มที่รายการเพื่อดูหลักฐาน
                                        </span>
                                    }
                                </div>

                                {/* Container transition */}
                                <div className={`
                                    wh-full flex flex-col p-4 py-2 
                                    ${
                                        dataTnx.length > 0 
                                        ? 'mt-1.5 bg-white shadow-md rounded-lg' 
                                        : 'mt-4'
                                    }
                                `}>
                                
                                    {/* Rows */}
                                    {
                                        dataTnx.map((item, index) => {
                                            return (
                                                <TransitionBox
                                                    key={index}
                                                    title={item.title}
                                                    subTitle={<>
                                                        <Moment format='DD/MM/YYYY . HH:mm' tz='Asia/Bangkok'>
                                                            {item.tnx_created_at || 'invalid date'}
                                                        </Moment>
                                                    </>}
                                                    amount={moneyFormat(item.amount || 0)}
                                                    bottomLine={index < dataTnx.length - 1}
                                                    onClick={() => handleClickViewTnx(item)}
                                                />
                                            )
                                        })
                                    }

                                    {
                                        dataTnx.length === 0 && (
                                            <div className={`w-full flex flex-col items-center`}>
                                                <p className={`text-secondary-text text-sm`}
                                                    style={{ lineHeight: '1.5rem' }}
                                                >
                                                    - ยังไม่มีธุรกรรมสาขา -
                                                </p>
                                            </div>
                                        )
                                    }

                                </div>

                            </div>

                        </div>
                        
                    </div>

                </div>

            </LayoutMain>
        </>
    )
}