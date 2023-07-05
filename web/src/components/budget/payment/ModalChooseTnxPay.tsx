import Link from 'next/link'
// Interfaces
import { CheckboxChangeEvent } from 'antd/es/checkbox'
// Components
import { 
    Button as MUI_Button, 
} from '@mui/material'
import { Button } from '@mui/material'
import { MessageInstance } from 'antd/es/message/interface'
import { Modal, Checkbox, message } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { routes } from '@/data/dict/routes_dict'
import { openMessageNoti } from '@/utils/helpers/functions'

interface itemInterface {
    nameBill: string,
    price: number,
    checked?: boolean
}

interface propsModalChooseTnx {
    statusChooseTnx: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    messageApi?: MessageInstance,
    TNXitems: itemInterface[]
}
export default function ModalChooseTnxPay({ 
    statusChooseTnx,
    TNXitems
}: propsModalChooseTnx) {
    
    const router = useRouter()
    const [messageApi, context] = message.useMessage()
    const [bounceChoose, setBounceChoose] = useState<boolean>(false)

    const [items, setItems] = useState<itemInterface[]>([])
    const [firstChecked, setFirstChecked] = useState<boolean>(true)


    useEffect(() => {
        TNXitems.map((item) => item.checked = true )
        setItems(TNXitems)
    }, [])


    const onChange = (e: CheckboxChangeEvent, index: number) => {
        setItems(prevState => {
            const updatedItems = [...prevState]
            updatedItems[index] = { ...updatedItems[index], checked: !updatedItems[index].checked }
            return updatedItems
        })
        setFirstChecked(false)
    }

    const handleClickContinuePayment = () => {
        let statusVerifyChoose = false
        items.forEach(item => {
            if (item.checked) statusVerifyChoose = true
        })

        if (statusVerifyChoose) {
            router.push(routes.budget_payment.path)
        } else {
            openMessageNoti(
                messageApi,
                'warning',
                'โปรดเลือกรายการที่ต้องการชำระ'
            )
            setBounceChoose(true)
            setTimeout(() => {
                setBounceChoose(false)
            }, 1500);
        }
    }


    return (
        <>
            { context }

            {/* Modal */}
            <Modal 
                open={statusChooseTnx.isOpen} 
                onCancel={() => statusChooseTnx.setOpen(false)}
                centered
                closable={false}
                footer={null}
            >
                <div className={`w-full text-original pb-2`}>
                    <p className={`font_kanit text-lg select-none`}>
                        รายการที่ต้องการชำระ 
                        {
                            firstChecked && <span className={`text-sm tracking-wide ml-2`}>(เลือกอัตโนมัติ)</span>
                        }
                    </p>
                    <div className={`mt-4 w-full grid gap-y-2.5`}>
                        {
                            items.map((item, index) => {
                                return (
                                    <Checkbox
                                        key={index}
                                        onChange={(e) => onChange(e, index)}
                                        className={`
                                            font_kanit m-0 py-4 px-4 shadow-md text-orginal
                                            ${item?.checked ? 'bg-sky-50' : 'bg-gray-100'}
                                            ${bounceChoose && 'animate-bounce'}
                                        `}
                                        checked={item?.checked}
                                    >
                                        <span className={`
                                            ml-2.5 ${item?.checked ? 'text-indigo-800' : 'text-black'}
                                        `}>
                                            บายสีสู่ขวัญ
                                        </span>
                                    </Checkbox>
                                )
                            })
                        }
                    </div>
                    
                    <MUI_Button
                        onClick={handleClickContinuePayment}
                        variant='contained'
                        className={`
                            mt-5 rounded-md py-3.5 w-full font_kanit text-orginal
                            font-normal tracking-wider bg-[#169A00]
                        `}
                    >
                        ดำเนินการชำระเงินต่อ
                    </MUI_Button>
                    <MUI_Button
                        onClick={() => statusChooseTnx.setOpen(false)}
                        variant='contained'
                        className={`
                            mt-2 rounded-md py-2 w-full font_kanit text-orginal 
                            font-normal tracking-wider bg-[#666666]
                        `}
                    >
                        ยกเลิก
                    </MUI_Button>

                </div>
            </Modal>
        
        </>
    )
}