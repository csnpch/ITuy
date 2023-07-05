import { routes } from '@/data/dict/routes_dict'
// Others
import LabelSelectShortValue from '@/components/LabelSelectShortValue'
import AccordionReportPayment from '@/components/admin/payment/AccordionReportPayment'
import LayoutMain from '@/components/layouts/main'
import PrepareDataStore from '@/components/store/PrepareDataStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getDataCollegian } from '@/store/slices/collegianReducer'
import { useEffect, useState } from 'react'
import { getDataClient } from '@/store/slices/clientSlice'
import { BillServices } from '@/services/api/bill'
import { AxiosError, AxiosResponse } from 'axios'
import { setDataBill, setPaginationBill } from '@/store/slices/billSlice'
import { getAccessToken } from '@/store/slices/authSlice'
import { openMessageNoti } from '@/utils/helpers/functions'
import { message } from 'antd'


export default function dashboardPayment() {

    const [messageApi, contextHolder] = message.useMessage()
    // Stores
    const dispatch = useDispatch()
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    // States
    const [yearStdSelect, setYearStdSelect] = useState<string>('all')
    const [loading, setLoading] = useState<boolean>(false)

    
    // Functions
    useEffect(() => {
        setYearStdSelect(dataClient?.username?.substring(0, 2) || 'all')
    }, [dataClient])

    return (
        <>
            { contextHolder }

            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.budget}
                currentRoute={routes.admin_budget_payment}
                stateLoding={{
                    state: loading,
                    setState: setLoading
                }}
            >

                <PrepareDataStore 
                    needDataNow
                    yearStd
                    section
                    bill
                />

                <div className='p-5 mb-10 mx-auto xl:w-[40%]'>

                    <p className={`mt-6 xl:mt-14 ml-0.5 mb-3 xl:mb-6 text-purple-700 text-lg xl:text-center`}>
                        รายงานการชำระเงินตามบิล
                    </p>

                    <AccordionReportPayment 
                        className={`mt-2 w-full mx-auto`}
                    />

                </div>

            </LayoutMain>
        </>
    )
}