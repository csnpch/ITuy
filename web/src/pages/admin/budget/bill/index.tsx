import { useState } from 'react'
import { routes } from '@/data/dict/routes_dict'
// Others
import AccordionReportBill from '@/components/admin/bill/AccordionReportBill'
import LayoutMain from '@/components/layouts/main'
import FloatingBtnAdd from '@/components/FloatingBtnAdd'
import ModalAddBill from '@/components/admin/bill/ModalAddBill'
import PrepareDataStore from '@/components/store/PrepareDataStore'
import { getAccessToken } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { formAddBillInterface } from '@/utils/helpers/yupFormSchema'
import { BillServices } from '@/services/api/bill'
import { AxiosError, AxiosResponse } from 'axios'
import { openMessageNoti } from '@/utils/helpers/functions'
import { errMsg } from '@/utils/messages'
import { message } from 'antd'
import { addDataBill } from '@/store/slices/billSlice'


export default function assignBill() {
    
    // Stores 
    const dispatch = useDispatch()
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    // States
    const [addBill, setAddBill] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage()
    
    const onSubmitFormModalAddBill = async (typeAction: string, dataForm: formAddBillInterface) => {
        if (typeAction === 'insert') {
            await BillServices.addBill(accessToken, dataForm)
                .then((res: AxiosResponse|any) => {
                    dispatch(addDataBill(res.data.data))
                    triggerResetFormAddBill()
                    setAddBill(false)
                    openMessageNoti(
                        messageApi, 
                        res.data.status_tag, 
                        ` ${res.data.message}`
                    )
                })
                .catch((err: AxiosError|any) => {
                    openMessageNoti(
                        messageApi, 
                        err.response?.data?.status_tag || 'error', 
                        ` ${err.response?.data?.message}` || errMsg.api.connect
                    )
                })
        }
    }

    const triggerResetFormAddBill = () => { }


    return (
        <>
            { contextHolder }

            <PrepareDataStore
                payment_method
                yearStd
                bill
                needDataNow
            />

            {/* Add Bill */}
            <FloatingBtnAdd 
                triggerState={{
                    valueIs: addBill,
                    setValue: setAddBill
                }}
            />

            <ModalAddBill
                modalState={{
                    isOpen: addBill,
                    setOpen: setAddBill
                }}
                onSubmitForm={onSubmitFormModalAddBill}
                resetForm={triggerResetFormAddBill}
            />


            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.budget}
                currentRoute={routes.admin_budget_bill}
            >

                <div className='p-5 mb-10 mx-auto xl:w-[40%]'>

                    <p className={`mt-6 xl:mt-14 ml-0.5 mb-3 xl:mb-6 text-purple-700 text-lg xl:text-center`}>
                        รายการบิลเรียกเก็บเงิน
                    </p>

                    <AccordionReportBill
                        className={`mt-2 w-full mx-auto`}
                    />

                </div>

            </LayoutMain>
        </>
    )
}