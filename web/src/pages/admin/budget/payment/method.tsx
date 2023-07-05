import { useEffect, useState } from 'react'
import { routes } from '@/data/dict/routes_dict'
import { AxiosError, AxiosResponse } from 'axios'
// Store
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getDataCollegian } from '@/store/slices/collegianReducer'
import { getDataClient } from '@/store/slices/clientSlice'
import { formAddPaymentMethodInterface } from '@/utils/helpers/yupFormSchema'
import { PaymentServices } from '@/services/api/payment'
import { getAccessToken } from '@/store/slices/authSlice'
import { 
    getDataPayment,
    addPaymentMethod,  
    updateStatusPaymentmethod
} from '@/store/slices/paymentSlice'
// Components
import LabelSelectShortValue from '@/components/LabelSelectShortValue'
import LayoutMain from '@/components/layouts/main'
import FloatingBtnAdd from '@/components/FloatingBtnAdd'
import AccordionPaymentMethod from '@/components/admin/payment/AccordionPaymentMethod'
import PrepareDataStore from '@/components/store/PrepareDataStore'
import ModalAddPaymentMethod from '@/components/admin/payment/ModalAddPaymentMethod'
import { message } from 'antd'
// Others
import { openMessageNoti } from '@/utils/helpers/functions'
import { PaymentMethodInterface } from '@/interfaces/payment'
import { CollegianObjectInterface } from '@/interfaces/collegian'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'
const swal = withReactContent(Swal)



export default function methodPayment() {

    const router = useRouter()

    const [messageApi, contextHolder] = message.useMessage()
    // Stores 
    const dispatch = useDispatch()
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    const dataPayment = useSelector((state: RootState) => getDataPayment(state))
    // States
    const [modalAddMethod, setModalAddMethod] = useState<boolean>(false)
    const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethodInterface[]>([])
    const [currentYearStdSelected, setCurrentYearStdSelected] = useState<string>('')
    const [triggerUseEffect, setTriggerUseEffect] = useState<boolean>(false)


    useEffect(() => {
        setCurrentYearStdSelected(dataClient?.username.substring(0, 2) || '')
        filterMethodFollowStdYear(dataClient?.username.substring(0, 2) || '')
    }, [dataPayment?.payment_method, triggerUseEffect])


    const onSubmitModalPaymentMethod = async (actionType: string, dataForm: formAddPaymentMethodInterface) => {
        if (actionType === 'insert') {
            await PaymentServices.addPaymentMethod(accessToken, dataForm)
                .then((res: AxiosResponse|any) => {
                    openMessageNoti(
                        messageApi, 
                        res.data.status_tag, 
                        ` ${res.data.message}`
                    )
                    setModalAddMethod(false)
                    triggerResetFormAddPaymentMethod()
                    dispatch(addPaymentMethod(res.data.data))
                })
                .catch((err: AxiosError|any) => {
                    openMessageNoti(
                        messageApi, 
                        (err.response?.data?.status_tag || 'error'),
                        ' ' + (err.response?.data?.message || 'เกิดข้อผิดพลาด ไม่สามารถเพิ่มช่องทางชำระเงินได้')
                    )
                })
        }
    
    }


    const onClickDisabledMethod = async (method: PaymentMethodInterface) => {
        swal.fire({
            title: 'ปิดช่องทางชำระเงินนี้ ?',
            html: <div className={`w-full`}>
                <p className='text-left mt-3'>
                    <span className='text-blue-800'>ผู้ครอบครองบัญชี</span>
                    <br />{method.method_identity}
                </p>
                <p className='text-left mt-2.5'>
                    <span className={`text-blue-800`}>พร้อมเพย์</span>
                    <br />{method.promptpay}
                </p>
            </div>,
            customClass: 'text-sm',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await PaymentServices.disabledMethod(accessToken, method.id)
                    .then((res: AxiosResponse|any) => {
                        dispatch(updateStatusPaymentmethod({id: method.id, status: -1}))
                        openMessageNoti(
                            messageApi, 
                            res.data.status_tag, 
                            ` ${res.data.message}`
                        )
                        router.push(routes.budget.path + `?sendBack=${routes.admin_budget_payment_method.path}`)
                    })
                    .catch((err: AxiosError|any) => {
                        openMessageNoti(
                            messageApi, 'error',
                            ' ' + (err.response?.data?.message || 'เกิดข้อผิดพลาด ไม่สามารถปิดช่องทางชำระเงินได้')
                        )
                    })
            }
        })
    }


    const onClickSetPrimaryMethod = async (method: PaymentMethodInterface) => {
        swal.fire({
            title: 'เลือกช่องทางชำระเงินนี้เป็นช่องทางหลัก ?',
            html: <div className={`w-full`}>
                <p className='text-left mt-3'>
                    <span className='text-blue-800'>ผู้ครอบครองบัญชี</span>
                    <br />{method.method_identity}
                </p>
                <p className='text-left mt-2.5'>
                    <span className={`text-blue-800`}>พร้อมเพย์</span>
                    <br />{method.promptpay}
                </p>
            </div>,
            customClass: 'text-sm leading-8',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await PaymentServices.setPrimaryMethod(accessToken, method.id)
                    .then((res: AxiosResponse|any) => {
                        dispatch(updateStatusPaymentmethod({id: method.id, status: 1}))
                        openMessageNoti(
                            messageApi, 
                            res.data.status_tag, 
                            ` ${res.data.message}`
                        )
                        router.push(routes.budget.path + `?sendBack=${routes.admin_budget_payment_method.path}`)
                    })
                    .catch((err: AxiosError|any) => {
                        openMessageNoti(
                            messageApi, 'error',
                            ' ' + (err.response?.data?.message || 'เกิดข้อผิดพลาด ไม่สามารถดำเนินการได้ในขณะนี้')
                        )
                    })
            }
        })
    }



    const triggerResetFormAddPaymentMethod = () => { }


    const filterMethodFollowStdYear = (value: string) => {
        const tmpMethods = dataPayment?.payment_method?.filter(item => item.target.includes(value)) || [];
        const primaryState = tmpMethods.filter(item => item.status === 1)
        const normalState = tmpMethods.filter(item => item.status === null)
        const disableState = tmpMethods.filter(item => item.status === -1)
        setDataPaymentMethod(
            primaryState.concat(normalState.concat(disableState))
        )
    }


    const onChangeMethodByStdYear = (value: CollegianObjectInterface['yearStd']) => {
        filterMethodFollowStdYear(value?.toString() || '')
        setCurrentYearStdSelected(value?.toString() || '')
    }


    
    return (
        <>
            { contextHolder }

            <PrepareDataStore 
                needDataNow
                yearStd
                payment_method
            />


            <FloatingBtnAdd 
                triggerState={{
                    valueIs: modalAddMethod,
                    setValue: setModalAddMethod
                }}
            />

            
            <ModalAddPaymentMethod
                modalState={{
                    isOpen: modalAddMethod,
                    setOpen: setModalAddMethod
                }}
                onSubmitForm={onSubmitModalPaymentMethod}
                resetForm={triggerResetFormAddPaymentMethod}
            />


            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.budget}
                currentRoute={routes.admin_budget_payment_method}
            >

                <div className='m-5 mb-20'>

                    <LabelSelectShortValue
                        label={`ช่องทางชำระเงินของปี`}
                        className={`mt-8`} 
                        items={dataCollegian?.yearStd || []}
                        defaultValue={dataClient?.username.substring(0, 2) || ''}
                        onSelected={onChangeMethodByStdYear}
                    />

                    <div className={`w-full mt-6 flex flex-col xl:flex-row gap-5 justify-stretch items-stretch`}>
                        
                        {
                            dataPaymentMethod.length !== 0 ? 
                            dataPaymentMethod.map((item: PaymentMethodInterface, index: number) => {
                                return (
                                    <AccordionPaymentMethod 
                                        key={index}
                                        data={item}
                                        ownerCheck={dataClient?.fullname || ''}
                                        onClickDisabledMethod={onClickDisabledMethod}
                                        onClickSetPrimaryMethod={onClickSetPrimaryMethod}
                                    />
                                )
                            })
                            : 
                            <p className={`mt-4 text-red-700 text-center tracking-wider text-sm select-none`}>
                                - ยังไม่มีช่องทางชำระเงินสำหรับชั้นปีนี้ -
                            </p>
                        }
                    </div>

                </div>

            </LayoutMain>
        </>
    )
}