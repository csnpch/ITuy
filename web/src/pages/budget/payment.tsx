import { useEffect, useState } from 'react'
// Datas
import { routes } from '@/data/dict/routes_dict'
// Utils
import { moneyFormat } from '@/utils/helpers/functions'
// Resources
import promptpayBanner from '@/assets/imgs/promptpay.webp'
import { Skeleton } from 'antd'
import { 
    Button as MUI_Button, 
} from '@mui/material'
// Lib For gen qr code
import generatePayload from 'promptpay-qr'
import QRCode from "react-qr-code"
import TransactionBox from '@/components/budget/TransactionBox'
// Components
import LayoutMain from '@/components/layouts/main'
import DrawerProofPayment from '@/components/budget/payment/DrawerProofPayment'
import { PaymentServices } from '@/services/api/payment'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/router'
import { PaymentDetectInterface, PaymentMethodInterface } from '@/interfaces/payment'
import { timerSwal } from '@/utils/sweetAlert'
import { getAccessToken } from '@/store/slices/authSlice'
import { getDataClient } from '@/store/slices/clientSlice'



export default function BudgetPayment() {

    const router = useRouter()
    const { billIDs } = router.query

    // stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    // states    
    const [openProofPayment, setOpenProofPayment] = useState<boolean>(false)
    const [dataPayment, setDataPayment] = useState<PaymentDetectInterface[]>([])
    const [valueQRcode, setValueQRcode] = useState<string>(generatePayload('', { amount: 0 }))
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethodInterface>()


    const detectPayment = async () => {

        if (!billIDs) {
            timerSwal({
                icon: 'error',
                title: 'ไม่พบรายการชำระเงินที่เลือก',
            })
            setTimeout(() => router.push(routes.budget.path), 1800)
            return
        }

        await PaymentServices.findMyPayment(accessToken)
            .then((res: any) => {
                const resDataPayment = res.data.data.items
                setDataPayment(resDataPayment.filter(
                    (item: PaymentDetectInterface) => billIDs.includes(item.bill_id)
                ))
            })
            .catch((_: any) => {
                timerSwal({
                    title: 'เกิดข้อผิดพลาด',
                    subTitle: `ไม่สามารถดึงข้อมูลรายการชำระเงินได้, โปรดลองใหม่อีกครั้งในภายหลัง`,
                    icon: 'error',
                })
            })

    }

    const sumTotalAmount = async () => {
        let total: string = '0' // Initialize as a string
        dataPayment.forEach((item: PaymentDetectInterface) => {
          console.log(item.amount)
          total = String(Number(total) + Number(item.amount)) // Convert total to number and add item.amount
        })
        setTotalAmount(Number(total)) // Convert total back to number
    }

    const fetchPaymentMethod = async () => {
        await PaymentServices.findActivePaymentMethodByTarget(
            accessToken, 
            dataClient?.username.substring(0, 2) || ''
        )
            .then((res: any) => {
                setDataPaymentMethod(res.data.data)
            })
            .catch((_: any) => {
                timerSwal({
                    title: 'เกิดข้อผิดพลาด',
                    subTitle: `ไม่พบช่องทางชำระเงินที่ใช้งานได้, โปรดแจ้งเหรัญญิก และลองใหม่อีกครั้งในภายหลัง`,
                    icon: 'error',
                })
                setTimeout(() => router.push(routes.budget.path), 1800)
            })
    }

    const initPromptPay = () => {
        setValueQRcode(generatePayload(dataPaymentMethod?.promptpay || '', { amount: totalAmount }))
        setLoading(false)
    }

    const handleUploadFile = async (file: any) => {

        const getListPaymentID = async () => {
            let paymentIDs: string[] = []
            dataPayment.forEach((item: PaymentDetectInterface) => {
                console.log(item)
                paymentIDs.push(item.payment_id)
            })
            return paymentIDs
        }

        
        try {
            const res: any = await PaymentServices.uploadProofPayment(
                accessToken,
                file,
                await getListPaymentID()
            )
            setOpenProofPayment(false)
            timerSwal({
                title: res.data.message || 'อัพโหลดหลักฐานการชำระเงินสำเร็จ',
                icon: 'success',
            })
            setTimeout(() => router.push(routes.budget.path), 1800)
        } catch (err: any) {
            timerSwal({
                title: err?.response?.data?.message || 'เกิดข้อผิดพลาด',
                icon: 'error',
                subTitle: 'เกิดข้อผิดพลาดในการอัพโหลดหลักฐาน, โปรดลองใหม่ในภายหลัง'
            })    
        }

    }
      

    useEffect(() => {
        detectPayment()
    }, [billIDs])
    

    useEffect(() => {
        (async () => {
            await sumTotalAmount()
            await fetchPaymentMethod()
        })()
    }, [dataPayment])

    useEffect(() => {

        initPromptPay()
        
    }, [dataPaymentMethod])


    return (
        <>


            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.budget}
                currentRoute={routes.budget_payment}
            >

                {
                    loading 
                    ?
                    <>Loading...</>
                    :
                    <div className={`w-full 2xl:w-4/12 xl:w-6/12 mx-auto`}>

                        {/* Container content */}
                        <div className={`
                            mb-20 font_kanit min-h-[4rem] w-full text-lg
                        `}>
                            
                            {/* Card QR CODE */}
                            <div className={`
                                m-5 flex flex-col p-4 py-6
                                bg-white shadow-md rounded-lg
                            `}>
                                
                                {/* QR CODE Container */}
                                <div className={`w-8/12 mx-auto`}>
                                
                                    <MUI_Button
                                        variant="contained"
                                        color='primary'
                                        className={`
                                            mb-2 rounded-md py-2 w-full font_kanit 
                                            font-normal tracking-wider bg-gray-600
                                        `}
                                    >
                                        บันทึกคิวอาร์โค๊ด
                                    </MUI_Button>
                                
                                    <div className={`w-full`}>
                                        <img 
                                            src={promptpayBanner.src} alt=''
                                            className={`
                                                select-none wh-full object-cover
                                            `}
                                        />
                                        {/* QR CODE IMAGE */}
                                        {
                                            valueQRcode === '' ?
                                            <Skeleton.Image 
                                                active={true} 
                                                className={`w-full h-64`}
                                            />
                                            :
                                            <QRCode 
                                                value={valueQRcode}
                                                className='wh-full shadow-md'
                                            />
                                        }
                                    </div>

                                </div>

                                {/* Description payment container */}
                                <div className={`
                                    mt-4 text-[#7D7D7D] text-sm flex flex-col 
                                    justify-center items-center gap-y-0.5
                                `}>
                                    <p>
                                        { dataPaymentMethod?.method_identity || 'ไม่พบชื่อผู้ถือครอบครองบัญชี' }
                                    </p>
                                    <p> 
                                        { 
                                            dataPaymentMethod?.reserve_identity &&
                                            ` หรือโอนมาที่ ${dataPaymentMethod?.reserve_identity}` 
                                        }
                                    </p>
                                </div>


                                {/* Bottom container */}
                                <div className={`
                                    w-11/12 mt-4 mx-auto
                                `}>
                                    

                                    <p className={`mt-2 text-orginal underline text-indigo-700`}>
                                        รายการชำระเงินที่เลือก
                                    </p>
                                    {
                                        dataPayment.map((item, index) => {
                                            return (
                                                <TransactionBox
                                                    key={index}
                                                    title={item.title}
                                                    amount={item.amount}
                                                    className={``}
                                                    classNameTitle={`text-sm`}
                                                    classAmount={`text-sm`}
                                                    bottomLine
                                                    disableHoverActive
                                                />
                                            )
                                        })
                                    }


                                    <div className={`
                                        mt-4 w-[98%] mx-auto text-sm flex text-red-700
                                        justify-between items-center gap-x-0.5
                                    `}>
                                        <span className={`text-lg text-under `}>
                                            ยอดที่ต้องชำระ
                                        </span>
                                        <div className={`flex justify-center items-center gap-x-1`}>
                                            <span className={`mt-0.5 select-none text-lg`}>฿</span>
                                            <span className={`text-[1.4rem] tracking-wider`}>
                                                { moneyFormat(totalAmount) }
                                            </span>
                                        </div>
                                    </div>

                                    
                                    <MUI_Button
                                        onClick={() => setOpenProofPayment(true)}
                                        variant='contained'
                                        color='primary'
                                        className={`
                                            mt-4 rounded-md py-2 w-full font_kanit 
                                            font-normal tracking-wider 
                                        `}
                                    >
                                        อัพโหลดหลักฐานการชำระเงิน ( Slip )
                                    </MUI_Button>

                                </div>
                                    
                            </div>
                        </div>

                        
                        <DrawerProofPayment
                            handleUploadFile={handleUploadFile}
                            statusDrawer={{
                                isOpen: openProofPayment, 
                                setOpen: setOpenProofPayment
                            }}
                        />

                    </div>
                }



            </LayoutMain>
        
        
        </>
    )
}