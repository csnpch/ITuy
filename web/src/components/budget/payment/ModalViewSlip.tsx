import configs from "@/configs"
import { getPaymentStageNameByStatusNum } from "@/data/dict/payment_dict"
import { BillInterface, dataRecipientsInterface } from "@/interfaces/bill"
import { PaymentDetectInterface } from "@/interfaces/payment"
import { Button } from "@mui/material"
import { Modal } from "antd"
import Link from "next/link"


interface propsModalViewSlip {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    payment?: PaymentDetectInterface|null,
}


export default function ModalViewSlip({ 
    modalState,
    payment = null,
}: propsModalViewSlip) {


    return (
        <>

            <Modal
                title='' 
                open={modalState.isOpen} 
                centered
                closable={false}
                footer={null}
                onCancel={() => modalState.setOpen(false)}
                className={`my-10`}
            >
                <div className={`pb-2 font_kanit flex-center flex-col`}>

                    <p className={`text-lg flex-center flex-col `}>
                        หลักฐานการชำะเงิน
                        <span className={`text-sm mt-1 text-black/70`}>
                            ( { getPaymentStageNameByStatusNum(payment?.status_payment || 0) } )
                        </span>
                    </p>
                    <p className='mt-4 mb-2 text-blue-800'>
                        บิล:&nbsp;&nbsp;
                        <span className='underline'>{ payment?.title || 'ไม่มีชื่อบิล' }</span>
                    </p>


                    <Link
                        href={`${configs.ITuy_API}/${payment?.img_evidence}`}
                        className={`mt-2 h-[16rem]`}
                        target='_blank'
                    >
                        <img
                            src={`${configs.ITuy_API}/${payment?.img_evidence}`} alt=''
                            className={`
                                select-none w-full h-full object-cover object-center
                            `}
                        />
                    </Link>
                    <p className={`mt-2.5 text-black/60`}>( จิ้มที่รูปเพื่อดูแบบเต็ม )</p>
                    
                    <Button
                        onClick={() => {
                            modalState.setOpen(false)
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