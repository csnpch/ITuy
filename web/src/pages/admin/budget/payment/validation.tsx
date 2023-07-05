import { useEffect, useState } from 'react'
import { routes } from '@/data/dict/routes_dict'
// Components
import ToggleBtnStatusPayment, { togglePaymentStatusState } from '@/components/admin/payment/ToggleBtnStatusPayment'
import LayoutMain from '@/components/layouts/main'
// Icons
import { TbReportMoney } from 'react-icons/tb'
import TransactionBox from '@/components/budget/TransactionBox'
import LabelSelectShortValue from '@/components/LabelSelectShortValue'
import ModalVerifyPayment from '@/components/admin/payment/ModalVerifyPayment'
import { moneyFormat } from '@/utils/helpers/functions'
import { getAccessToken } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { BillInterface, dataRecipientsInterface } from '@/interfaces/bill'
import { getDataCollegian } from '@/store/slices/collegianReducer'
import { getDataClient } from '@/store/slices/clientSlice'
import { BillServices } from '@/services/api/bill'
import { AxiosError, AxiosResponse } from 'axios'
import PrepareDataStore from '@/components/store/PrepareDataStore'
import { convertSectionLetterToNum } from '@/data/dict/section_dict'
import Moment from "react-moment"
import 'moment-timezone';


interface stateSearch {
    needSearch: boolean,
    onSearch: boolean
}


export default function validationPayment() {

    const router = useRouter()

    // Stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    // States
    const bill_id = router.query.bill_id as string
    const [setup, setSetup] = useState<boolean>(false)
    const [bill, setBill] = useState<BillInterface>()
    const [recipient, setRecipient] = useState<dataRecipientsInterface>()
    const [toggleStatusPayment, setToggleStatusPayment] = useState<togglePaymentStatusState>('hold_check')
    const [modalVerifyPayment, setModalVerifyPayment] = useState<boolean>(false)
    const [search, setSearch] = useState<stateSearch>({ needSearch: false, onSearch: false })
    const [loading, setLoading] = useState<boolean>(false)
    const [conditionYearStd, setConditionYearStd] = useState<string>('all')
    const [conditionSectionStd, setConditionSectionStd] = useState<string>('all')


    useEffect(() => {
        if (bill_id) {
            if (!setup) {
                setConditionYearStd(dataClient?.username?.substring(0, 2) || 'all')
                setSetup(true)
            }
            fetchBill(bill_id)
        }
    }, [bill_id, dataClient, conditionYearStd, conditionSectionStd])


    const triggerFetchBill = async () => {
        await fetchBill(bill_id)
    }


    const fetchBill = async (bill_id: string) => {

        let sectionStd = conditionSectionStd === 'all' ? conditionSectionStd
            : convertSectionLetterToNum(conditionSectionStd)
        

        await BillServices.getBllById(
            accessToken, 
            bill_id, 
            conditionYearStd,
            sectionStd
        )
            .then((res: AxiosResponse) => {
                setLoading(false)
                setBill(res.data.data)
            })
            .catch((err: AxiosError|any) => {
                setLoading(false)
                errorPushExit(err.response?.data?.message || `เกิดข้อผิดพลาด, ไม่สามารถตรวจสอบแบบละเอียดได้`)
            })
    
    }


    const errorPushExit = (msg: string) => {
        alert(msg)
        router.push(routes.admin_budget_payment.path)
    }


    const handleChangeToggleButton = (
        _: React.MouseEvent<HTMLElement>, // event: type 
        value: togglePaymentStatusState,
    ) => {
        setToggleStatusPayment(value)
    }

    const handleOpenModalVerifyPayment = (item: dataRecipientsInterface) => {
        setModalVerifyPayment(true)
        setRecipient(item)
    }

    const handleSelectConditionYearStd = async (value: string) => {
        setConditionYearStd(value)

        setLoading(true)
        setTimeout(() => { setLoading(false) }, 1000)
        setSearch({
            ...search,
            onSearch: false
        })
    }


    const handleSelectConditionSectionStd = async (value: string) => {
        setConditionSectionStd(value)
        setLoading(true)
    }
    


    return (
        <>

            <PrepareDataStore
                yearStd
                section
            />

            <ModalVerifyPayment
                bill={bill || null}
                recipient={recipient || null}
                triggerFunction={triggerFetchBill}
                modalState={{
                    isOpen: modalVerifyPayment,
                    setOpen: setModalVerifyPayment
                }}
            />

            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.admin_budget_payment}
                currentRoute={routes.admin_budget_payment_validation}
                stateLoding={{
                    state: loading,
                    setState: setLoading
                }}
            >

                <div className={`p-5 mt-4 xl:w-[40%] mx-auto mb-10`}>

                    <div className={`w-full flex justify-between items-center`}>
                        <p className={`
                            w-full text-center text-lg flex flex-row 
                            justify-start items-start gap-x-2 
                        `}>
                            <TbReportMoney className={`text-2xl`} />
                            { bill?.title || 'ไม่มีชื่อบิล' }
                        </p>
                        {/* <Button 
                            type={`${search.needSearch ? 'dashed' : 'primary'}`} 
                            shape="circle"
                            onClick={() => setSearch({
                                ...search, 
                                needSearch: !search.needSearch,
                                onSearch: !search.needSearch ? true : false
                            })} 
                            icon={
                                search.needSearch 
                                ? <CloseOutlined />
                                : <SearchOutlined />
                            } 
                        /> */}
                    </div>
                    

                    {/* STD Year select */}
                    <LabelSelectShortValue
                        className={`mt-6 ${search.needSearch && 'hidden'}`}
                        labelClassName={`text-lg text-blue-800`}
                        label={`ชั้นปีที่ตรวจสอบ`}
                        defaultValue={dataClient?.username?.substring(0, 2) || 'all'}
                        items={['all'].concat((dataCollegian?.yearStd || []).map(String))}
                        onSelected={handleSelectConditionYearStd}
                    />

                    
                    {/* STD Section select */}
                    <LabelSelectShortValue
                        className={`mt-2 ${search.needSearch && 'hidden'}`}
                        labelClassName={`text-lg text-blue-800`}
                        label={`ตอนเรียนที่ตรวจสอบ`}
                        defaultValue={'all'}
                        items={
                            ['all'].concat(dataCollegian?.section?.map(item => item.sec_name) || [])
                                .filter(item => item.toLowerCase() !== 'other')
                        }
                        onSelected={handleSelectConditionSectionStd}
                    />


                    <div className={`mt-4 text-rose-700 w-full text-lg flex flex-row justify-between ${search.needSearch && 'hidden'}`}>
                        <span>ยอดเงินที่เรียกเก็บ</span>
                        <span className='mr-1'>฿&nbsp;{ moneyFormat(bill?.amount || 0) }</span>
                    </div>


                    <div className={`mt-8 text-cyan-800 text-lg text-center ${search.needSearch && 'hidden'}`}>
                        กำลังตรวจสอบ:&nbsp;&nbsp;
                        { conditionYearStd === 'all' ? 'ทุกชั้นปี' : `ปี ${conditionYearStd}` }&nbsp;,&nbsp;&nbsp;
                        { conditionSectionStd === 'all' ? 'ทุกตอนเรียน' : `ตอนเรียน ${conditionSectionStd}` }
                    </div>


                    {/* Search */}
                    {/* {
                        search.needSearch &&
                        <p className={`mt-4 text-black/80 leading-6`}>
                            ค้นหาบุคคลที่ต้องการตรวจสอบด้วย `ชื่อนักศึกษา`,`รหัสนักศึกษา` ของบุคคลที่ต้องการค้นหา
                        </p>
                    }
                    
                    <Search 
                        className={`
                            font_kanit mt-2.5
                            ${search.needSearch || 'hidden'}
                        `}
                        placeholder="Fullname or Student No."
                        enterButton="Search"
                        size="large"
                        loading={false}
                    /> */}


                    {/* Status */}
                    <ToggleBtnStatusPayment 
                        className={`mt-6 ${search.needSearch && 'hidden'}`}
                        toggleState={{
                            value: toggleStatusPayment,
                            setValue: setToggleStatusPayment
                        }}
                        totalItemOfStatus={{
                            paid: bill?.recipient.paid.count || 0,
                            hold: bill?.recipient.hold.count || 0,
                            hold_check: bill?.recipient.hold_check.count || 0,
                            callback: bill?.recipient.callback.count || 0
                        }}
                        handleChange={handleChangeToggleButton}
                    />

                    
                    <div className={`mt-6 ${(search.onSearch || loading) && 'hidden'}`}>
                        {bill?.recipient[toggleStatusPayment]?.data?.map((item, index) => {
                            return (
                                <TransactionBox
                                    key={index}
                                    item={item}
                                    className='w-full'
                                    onClick={
                                        toggleStatusPayment !== 'hold' 
                                        ? handleOpenModalVerifyPayment : undefined}
                                    title={item.fullname || '- ผู้ใช้ยังไม่ได้ตั้งชื่อเต็ม -'}
                                    subTitle={item.username || '- ไม่พบรหัสนักศึกษา -'}
                                    amount={bill.amount || 0}
                                    disableHoverActive={toggleStatusPayment === 'hold'}
                                    textStatusTnx={
                                        <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                            {item.updated_at_payment || 'invalid date'}
                                        </Moment>
                                    }
                                    classNameSubTitle='tracking-wider'
                                    bottomLine={index < bill?.recipient[toggleStatusPayment]?.data?.length - 1}
                                />
                            )
                        }) || []}

                        {
                            bill?.recipient[toggleStatusPayment]?.data?.length === 0 &&
                            <div className={`mt-8 text-center text-gray-500`}>
                                - ไม่พบข้อมูล -
                            </div>
                        }
                    </div>
                    

                </div>

            </LayoutMain>
        </>
    )
}