import Link from 'next/link'
import { useRouter } from 'next/router'

import { routes } from '@/data/dict/routes_dict'
import configs from '@/configs'
import { useEffect, useRef, useState } from 'react'

// Others
import { Button } from '@mui/material'
import { Modal, message } from 'antd'
import TransactionBox from '@/components/budget/TransactionBox'
import { openMessageNoti } from '@/utils/helpers/functions'
import { BillInterface, dataRecipientsInterface } from '@/interfaces/bill'
import { PaymentServices } from '@/services/api/payment'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getAccessToken } from '@/store/slices/authSlice'
import { getPaymentStageNameByStatusNum, paymentDict } from '@/data/dict/payment_dict'
import Moment from "react-moment"
import 'moment-timezone'
import { PaymentDetectInterface } from '@/interfaces/payment'
import { timerSwal } from '@/utils/sweetAlert'
import RowTiteValue from '@/components/RowLabelValue'



interface propsModalVerifyPayment {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    bill?: BillInterface|null,
    recipient?: dataRecipientsInterface|null,
    triggerFunction?: () => void
}

export default function ModalVerifyPayment({ 
    modalState,
    bill = null,
    recipient = null,
    triggerFunction = () => {}
}: propsModalVerifyPayment) {

    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const [messageApi, contextHolder] = message.useMessage();
    const [statusConfirm, setStatusConfirm] = useState<number>(-1)
    const [relationPayment, setRelationPayment] = useState<PaymentDetectInterface[]>([])


    const fetchRelationPayment = async () => {
        try {

            const res: any = await PaymentServices.getRelationPayment(accessToken, recipient?.relation_key || '')
            setRelationPayment(res.data)

        } catch (err: any) {
            timerSwal({
                title: 'เกิดข้อผิดพลาด',
                subTitle: 'ไม่สามารถดึงรายการชำระเงินที่มีความสัมพันธ์กับสลิปนี้ได้',
                icon: 'error'
            })
        }
    }


    useEffect(() => {
        fetchRelationPayment()
    }, [bill, recipient])


    const handleConfirmVerify = async () => {
        
        const responseDone = (res: any) => {
            setTimeout(() => { triggerFunction() }, 500)
            modalState.setOpen(false)
            setStatusConfirm(-1)
            openMessageNoti(
                messageApi,
                res.data.status_tag || 'info',
                res.data.message || 'ดำเนินการสำเร็จ แต่เกิดการตอบกลับที่ไม่ปกติ'
            )
        }

        const responseErr = (err: any) => {
            modalState.setOpen(false)
            setStatusConfirm(-1)
            openMessageNoti(
                messageApi,
                err?.response?.data?.status_tag || 'error',
                err?.response?.data?.message || 'เกิดข้อผิดพลาดในการดำเนินการ'
            )
        }
        
        (statusConfirm === 1) 
            ? await PaymentServices.acceptPayment(accessToken, recipient?.id || '')
                .then((res) => { responseDone(res) })
                .catch((err) => { responseErr(err) })
            : await PaymentServices.rejectPayment(accessToken, recipient?.id || '')
                .then((res) => { responseDone(res) })
                .catch((err) => { responseErr(err) })

    }


    return (
        <>
            { contextHolder }

            <Modal 
                title='' 
                open={modalState.isOpen} 
                centered
                closable={false}
                footer={null}
                className={`my-10`}
            >
                <div className={`pb-2 font_kanit flex-center flex-col`}>

                    <p className={`text-lg flex-center flex-col `}>
                        หลักฐานการชำะเงิน
                        <span className={`text-sm mt-1 text-black/70`}>
                            ( { getPaymentStageNameByStatusNum(recipient?.status || 0) } )
                        </span>
                    </p>
                    <p className='mt-4 mb-2 text-blue-800'>
                        บิล:&nbsp;&nbsp;
                        <span className='underline'>{ bill?.title || 'ไม่มีชื่อบิล' }</span>
                    </p>

                    {
                        relationPayment && relationPayment.length > 0 &&
                        <div className='w-[88%] mb-2.5 mt-2'>
                            <p className='text-sm text-red-700 tracking-wider'>
                                สลิปนี้ใช้ตรวจสอบ {relationPayment.length - 1} รายการ ดังนี้
                            </p>
                            <div className='mt-2 flex flex-col gap-y-2 text-xs'>
                                {
                                    relationPayment.map((item, index) => {
                                        if (item?.title === bill?.title) return null
                                        return (
                                            <p key={index}>
                                                <RowTiteValue
                                                    label={`- ${item?.title}`}
                                                    value={item?.amount || '0'}
                                                />
                                            </p>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }


                    <Link 
                        href={`${configs.ITuy_API}${recipient?.img_evidence}`}
                        className={`mt-2 h-[16rem]`}
                        target='_blank'
                    >
                        <img
                            src={`${configs.ITuy_API}${recipient?.img_evidence}`} alt=''
                            className={`
                                select-none w-full h-full object-cover object-center
                            `}
                        />
                    </Link>
                    <p className={`mt-2.5 text-black/60`}>( จิ้มที่รูปเพื่อดูแบบเต็ม )</p>
                        

                    <TransactionBox
                        className={`w-11/12 mt-2`}
                        title={recipient?.fullname || '- ผู้ใช้ยังไม่ได้ตั้งชื่อเต็ม -'}
                        subTitle={recipient?.username || '- ไม่พบรหัสนักศึกษา -'}
                        amount={bill?.amount || 0}
                        textStatusTnx={
                            <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                {recipient?.created_at || 'invalid date'}
                            </Moment>
                        }
                        classNameSubTitle='tracking-wider'
                        disableHoverActive
                    />
                    

                    <p 
                        className={`
                            text-orginal pb-3
                            ${statusConfirm === -1 && 'hidden'}
                            ${statusConfirm === 0 && 'text-red-700'}
                            ${statusConfirm === 1 && 'text-blue-700'}
                        `}
                    >
                        โปรดยืนยันว่า "{ 
                            statusConfirm === 0 ? 'หลักฐานไม่ถูกต้อง'
                            : statusConfirm === 1 && 'หลักฐานถูกต้อง'
                        }"
                    </p>


                    {/* Normal */}
                    <div className='w-[88%]'>
                        <div className={`
                            w-full grid gap-x-2
                            ${statusConfirm !== -1 && 'hidden'}
                            ${
                                (
                                    recipient?.status !== paymentDict.paid.status
                                    && recipient?.status !== paymentDict.callback.status 
                                )
                                ? 'grid-cols-2'
                                : 'grid-cols-1' 
                            }
                        `}>

                            {
                                recipient?.status !== paymentDict.callback.status &&
                                <Button
                                    onClick={() => setStatusConfirm(0)}
                                    variant="contained" 
                                    className={`
                                        w-full font_kanit tracking-wider 
                                        font-light text-orginal
                                        ${
                                            recipient?.status !== paymentDict.paid.status 
                                            ? 'bg-[#F13A00] py-2.5'
                                            : 'bg-[#666666]'
                                        }
                                    `}
                                >
                                    {
                                        recipient?.status !== paymentDict.paid.status
                                        ? 'ไม่ถูกต้อง'
                                        : 'ปรับเป็นหลักฐานผิด'
                                    }
                                </Button>
                            }


                            {
                                recipient?.status === paymentDict.paid.status &&
                                <div className='mt-3 text-sm flex-center flex-col'>
                                    <span className='text-blue-700 text-center'>
                                        **รายการชำระนี้ได้ผ่านการชำระแล้ว**
                                    </span>
                                    <span className='text-black text-center mt-1'>
                                        หากเห็นภายหลังว่าหลักฐานการชำระผิด ให้จิ้มปุ่ม "ปรับเป็นหลักฐานผิด" ด้านล่าง
                                    </span>
                                </div>
                            }

                            
                            {
                                recipient?.status !== paymentDict.paid.status &&
                                <Button
                                    onClick={() => setStatusConfirm(1)}
                                    variant="contained" 
                                    className={`
                                        w-full font_kanit
                                        tracking-wider font-light text-orginal
                                        ${
                                            recipient?.status !== paymentDict.callback.status 
                                            ? 'bg-[#169A00] py-2.5'
                                            : 'bg-[#666666]'
                                        } 
                                    `}
                                >
                                    {
                                        recipient?.status !== paymentDict.callback.status
                                        ? 'ถูกต้อง'
                                        : 'ปรับเป็นหลักฐานถูก'
                                    }
                                </Button>
                            }
                            
                            {
                                recipient?.status === paymentDict.callback.status &&
                                <span className='mt-4 text-black text-center'>
                                    หากเห็นภายหลังว่าหลักฐานการชำระถูกต้อ ให้จิ้มปุ่ม "ปรับเป็นหลักฐานถูก"
                                </span>
                            }

                        </div>
                        <div className={`
                            w-full grid grid-cols-2 gap-x-2
                            ${statusConfirm === -1 && 'hidden'}
                        `}>
                            <Button
                                onClick={() => setStatusConfirm(-1)}
                                variant="contained" 
                                className={`
                                    w-full font_kanit py-2.5 bg-[#666666]
                                    tracking-wider font-light text-orginal   
                                `}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                onClick={handleConfirmVerify}
                                variant="contained" 
                                className={`
                                    w-full font_kanit py-2.5
                                    tracking-wider font-light text-orginal   
                                `}
                            >
                                ยืนยัน
                            </Button>
                        </div>
                    </div>

                    
                    <Button
                        onClick={() => {
                            modalState.setOpen(false)
                            setStatusConfirm(-1)
                        }}
                        variant="contained" 
                        className={`
                            w-[88%] mt-6 font_kanit bg-[#4A4A4A]
                            tracking-wider font-light text-orginal   
                        `}
                    >
                        ปิด
                    </Button>
                    

                </div>
            </Modal>
        
        </>
    )
}