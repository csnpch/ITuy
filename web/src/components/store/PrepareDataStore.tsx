import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// Stores
import { RootState, store } from '@/store'
import { CollegianServices } from '@/services/api/collegian'
import { fetchAccessTokenFromStorage, getAccessToken, getStatusVerifyAuth } from '@/store/slices/authSlice'
import { fetchDataClientFromStorage, getDataClient } from '@/store/slices/clientSlice'
import { getDataPayment, setPaymentMethod } from '@/store/slices/paymentSlice'
import { getDataCollegian, setSection, setYearStd } from '@/store/slices/collegianReducer'
import { PaymentServices } from '@/services/api/payment'
import { BillServices } from '@/services/api/bill'
import { getPaginationBill, setDataBill, setPaginationBill } from '@/store/slices/billSlice'
import { DataTransferObject } from '@/interfaces/share/response'
import { AxiosResponse } from 'axios'



interface StatusPrepareDataInterface {
    needDataNow?: boolean,
    // Client
    client?: boolean,
    // Collegian
    section?: boolean,    
    // Payment
    yearStd?: boolean,
    payment_method?: boolean
    // Bill
    bill?: boolean
}


interface PropsPrepareDataStore {
    callbackStatus?: () => StatusPrepareDataInterface 
}


export default function PrepareDataStore({
    needDataNow = false,
    section = false,
    yearStd = false,
    payment_method = false,
    bill = false
}: StatusPrepareDataInterface & PropsPrepareDataStore) {

    // Store
    const dispatch = useDispatch()

    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    const dataPayment = useSelector((state: RootState) => getDataPayment(state))
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const paginationBill = useSelector((state: RootState) => state.bill.pagination)
    // Stage
    const [statusPrepareData, setStatusPrepareData] = useState<StatusPrepareDataInterface>({
        // Collegian
        section: false,
        yearStd: false,
        // Payment
        payment_method: false,
        // Bill
        bill: false
    })


    useEffect(() => {
        fetchData()
    }, [])


    const fetchData = async () => {
        
        try {

            // Client
            await Promise.all([
                client && await client.fetchAccessToken(),
                client && await client.fetchDataClient()
            ])

            // Collegian
            await Promise.all([
                yearStd && await collegian.fetchYearStd(),
                section && await collegian.fetchSection()
            ])

            // Payment
            await Promise.all([
                payment_method && await payment.method.fetchMethod()
            ])

            await Promise.all([
                bill && await _bill.fetchBill()
            ])
            
        } catch (err: any) { console.error(err) }  

    }

    const client = {
        fetchAccessToken: async () => {
            dispatch(fetchAccessTokenFromStorage())
        },
        fetchDataClient: async () => {
            dispatch(fetchDataClientFromStorage())
        }
    }

    const collegian = {
        fetchYearStd: async () => {
            if (dataCollegian?.yearStd && !needDataNow) return
    
            await CollegianServices.getYearStd()
                .then((res: any) => {
                    dispatch(setYearStd(res.data.data))
                    setStatusPrepareData(prevState => ({
                        ...prevState, 
                        yearStd: true
                    }))
                })
        },
        fetchSection: async () => {
            if (dataCollegian?.section && !needDataNow) return
    
            await CollegianServices.getSection()
                .then((res: any) => {
                    dispatch(setSection(res.data.data))
                    setStatusPrepareData(prevState => ({
                        ...prevState, 
                        section: true
                    }))
                })
        }
    }
    
    const payment = {
        method: {
            fetchMethod: async () => {
                if (dataPayment?.payment_method && !needDataNow) return
        
                await PaymentServices.getPaymentMethod(accessToken)
                    .then((res: any) => {
                        dispatch(setPaymentMethod(res.data.data))
                        setStatusPrepareData(prevState => ({
                            ...prevState, 
                            payment_method: true
                        }))
                    })
            },
        }
    } 


    const _bill = {
        fetchBill: async () => {
            if (!needDataNow) return

            await BillServices.getBill(accessToken, paginationBill?.currentPage || 1)
                .then((res: AxiosResponse|any) => {
                    dispatch(setDataBill(res.data.data))
                    setStatusPrepareData(prevState => ({
                        ...prevState, 
                        bill: true
                    }))
                    dispatch(setPaginationBill(res.data.pagination))
                })
        } 
    }
    
    return (
        <>
        </>
    )
}