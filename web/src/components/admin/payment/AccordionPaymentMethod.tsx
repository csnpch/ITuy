// Components
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import { Button } from "@mui/material"
import ColLabelValue from '@/components/ColLabelValue'
// Interfaces
import { PaymentMethodInterface } from "@/interfaces/payment"
import { paymentMethodDict } from "@/data/dict/payment_dict"


interface propsInterface {
    className?: string,
    data: PaymentMethodInterface
    ownerCheck?: string,
    onClickSetPrimaryMethod?: (method: PaymentMethodInterface) => void
    onClickDisabledMethod?: (method: PaymentMethodInterface) => void
}


export default function AccordionPaymentMethod({
    className = '',
    data,
    ownerCheck = '',
    onClickSetPrimaryMethod = () => {},
    onClickDisabledMethod = () => {}
}: propsInterface) {

    return (
        <>
            <div className={`wh-full ${className}`}>
                <Accordion>
                    <AccordionSummary>
                        <div className='wh-full py-1 flex flex-col gap-y-6 font_kanit'>
                            
                            
                            {
                                data.status === paymentMethodDict.primary.status &&
                                <p className={`
                                    w-full bg-green-700 py-2 font_kanit text-white text-original text-center rounded-md
                                `}>
                                    ช่องทางชำระเงินหลัก
                                </p>
                            }
                            <ColLabelValue 
                                label={`ผู้ครอบครองบัญชี`}
                                value={data.method_identity || '-'}
                                labelClassName={`text-blue-800`}
                                valueClassName={`text-black/80 text-sm`}
                            />
                            
                            {
                                data.status !== paymentMethodDict.disable.status &&
                                <ColLabelValue
                                    label={`ช่องทางสำรอง`}
                                    value={data.reserve_identity || '-'}
                                    labelClassName={`text-blue-800`}
                                    valueClassName={`text-black/80 text-sm`}
                                />
                            }


                            <ColLabelValue 
                                label={`พร้อมเพย์`}
                                value={data.promptpay || '-'}
                                labelClassName={`text-blue-800`}
                                valueClassName={`text-black/80 text-sm`}
                            />

                            {
                                data.status !== paymentMethodDict.disable.status &&
                                <ColLabelValue 
                                    label={`ผู้สร้าง`}
                                    value={
                                        ownerCheck === data.owner_name 
                                        ? 'คุณ' 
                                        : data.owner_name || ''
                                    }
                                    labelClassName={`text-blue-800`}
                                    valueClassName={`text-black/80 text-sm`}
                                />
                            }

                            {
                                data.status === paymentMethodDict.disable.status &&
                                <ColLabelValue
                                    label={`* ช่องทางชำระเงินนี้ถูกปิดแล้ว`}
                                    labelClassName={`mr-1 text-blue-800 text-right text-red-700`}
                                />
                            }


                        </div>
                    </AccordionSummary>
                    <AccordionDetails className={`${
                        data.status === paymentMethodDict.disable.status 
                        && 'hidden'
                    }`}>
                        <div className={`w-full pb-2.5 flex flex-col justify-center`}>
                            
                            <div className={`w-full -mt-3 mb-4 h-[0.1rem] bg-black/20`} />

                            {
                                (
                                    data.status !== paymentMethodDict.disable.status 
                                    && data.status !== paymentMethodDict.primary.status 
                                ) ?
                                <>
                                    {
                                        data.status !== 1 &&
                                        <Button
                                            onClick={() => onClickSetPrimaryMethod(data)}
                                            variant="contained" 
                                            className={`
                                                w-11/12 mx-auto mt-2 font_kanit
                                                tracking-wider font-normal bg-blue-600
                                            `}
                                        >
                                            เลือกช่องทางนี้เป็นช่องทางหลัก
                                        </Button>
                                    }
                                    {
                                        (
                                            data.status === paymentMethodDict.normal.status 
                                            || data.status !== paymentMethodDict.primary.status
                                        ) &&
                                        <Button
                                            onClick={() => onClickDisabledMethod(data)}
                                            variant="contained" 
                                            className={`
                                                w-11/12 mx-auto mt-2 font_kanit
                                                tracking-wider font-normal bg-black/70
                                            `}
                                        >
                                            ปิดใช้งานช่องทางชำระนี้
                                        </Button>
                                    }
                                </>
                                : <span className={`text-center text-sm text-black/60`}>- ไม่มีแอคชั่นใด ๆ -</span>
                            }

                        </div>
                    </AccordionDetails>
                </Accordion>

            </div>
        </>
    )
}
