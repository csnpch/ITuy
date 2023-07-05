import configs from "@/configs"
import { transactionInterface } from "@/interfaces/transaction"
import { moneyFormat } from "@/utils/helpers/functions"
import { Button } from "@mui/material"
import { Modal } from "antd"
import Link from "next/link"
import ColTitleValue from "../ColLabelValue"
import RowTiteValue from "../RowLabelValue"


interface propsModalViewTnx {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    transaction?: transactionInterface|null,
}


export default function ModalViewTnx({ 
    modalState,
    transaction = null,
}: propsModalViewTnx) {


    return (
        <>

            <Modal
                title='' 
                open={modalState.isOpen} 
                centered
                closable={false}
                onCancel={() => modalState.setOpen(false)}
                footer={null}
                className={`my-10`}
            >
                <div className={`pb-2 font_kanit flex-center flex-col`}>

                    <p className={`text-lg flex-center flex-col`}>
                        หลักฐานการเบิกงบประมาณ
                    </p>
                    <div className="2xl:px-6 w-full flex flex-col gap-2.5 mt-6">
                        <ColTitleValue
                            label={'ชื่องบประมาณ'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={transaction?.title || 'ไม่มีรายละเอียด'}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        <ColTitleValue
                            label={'รายละเอียด'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={transaction?.description || '-'}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        <ColTitleValue
                            label={'ผู้เบิก'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={transaction?.owner_name || '-'}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        <ColTitleValue
                            label={'ยอดเงินที่เบิก'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={`฿ ${moneyFormat(transaction?.amount || 0)}` || '-'}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                    </div>

                    <Link
                        href={`${configs.ITuy_API}/${transaction?.link_evidence || ''}`}
                        className={`mt-2 text-lg`}
                        target='_blank'
                    >
                        <p className={`mt-2.5 text-black/60`}>🔗&nbsp;
                        <span className="underline text-red-700">หลักฐานแนบเบิก</span></p>
                    </Link>
                    
                    <Button
                        onClick={() => {
                            modalState.setOpen(false)
                        }}
                        variant="contained" 
                        className={`
                            w-full h-9 mt-6 font_kanit bg-[#585858]
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