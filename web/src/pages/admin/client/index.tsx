import { useEffect, useState } from 'react'
import { routes } from '@/data/dict/routes_dict'
// Store
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getDataCollegian } from '@/store/slices/collegianReducer'
import { getDataClient } from '@/store/slices/clientSlice'
import { getAccessToken } from '@/store/slices/authSlice'
// Components
import LabelSelectShortValue from '@/components/LabelSelectShortValue'
import LayoutMain from '@/components/layouts/main'
import PrepareDataStore from '@/components/store/PrepareDataStore'
import { message } from 'antd'
// Others
import { CollegianObjectInterface } from '@/interfaces/collegian'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'
import { ClientInterface } from '@/interfaces/client'
import { convertSectionLetterToNum, convertSectionNumStrToLetter } from '@/data/dict/section_dict'
import { ClientServices } from '@/services/api/client'
import { timerSwal } from '@/utils/sweetAlert'
import TransactionBox from '@/components/budget/TransactionBox'
import Moment from "react-moment"
import 'moment-timezone'
import { getRoleNameByStatus } from '@/data/dict/role_dict'
import { Tab, Tabs } from '@mui/material'
import ModalViewClient from '@/components/admin/client/ModalViewClient'

const swal = withReactContent(Swal)




export default function ClientManagePage() {

    // Stores 
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    // States
    const [onTab, setOnTab] = useState<number>(0)
    const [listDataClient, setListDataClient] = useState<ClientInterface[]>([])
    const [listDataClientHoldAccept, setListDataClientHoldAccept] = useState<ClientInterface[]>([])
    const [showDataClient, setShowDataClient] = useState<ClientInterface[]>([])
    const [currentYearStdSelected, setCurrentYearStdSelected] = useState<string>(dataClient?.username.substring(0, 2) || 'all')
    const [currentSectionSelected, setCurrentSectionSelected] = useState<string>('all')
    const [modalViewClient, setModalViewClient] = useState<boolean>(false)
    const [clientView, setClientView] = useState<ClientInterface | null>(null)
    

    const handleChangeFilterYear = (value: CollegianObjectInterface['yearStd']) => {
        setCurrentYearStdSelected(value?.toString() || '')
    }
    
    const handleChangeFilterSection = (value: CollegianObjectInterface['section']) => {
        setCurrentSectionSelected(value?.toString() || '')
    }


    const fetchDataClient = async () => {
    
        try {

            const res = await ClientServices.getListDataClient(
                accessToken, 
                currentYearStdSelected, 
                convertSectionLetterToNum(currentSectionSelected)
            )
            const dataClient: ClientInterface[] = res.data.clients
            setListDataClient(dataClient.filter(item => item.role !== null))
            setListDataClientHoldAccept(dataClient.filter(item => item.role === null))
            setShowDataClient(dataClient.filter(item => item.role === null))

        } catch (err) {  
            timerSwal({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                subTitle: 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้ในขณะนี้',
            })
        }
    
    }


    const handleChangeTab = (_: React.ChangeEvent<{}>, newValue: number) => {
        setOnTab(newValue)
        setShowDataClient(newValue === 0 ? listDataClientHoldAccept : listDataClient)
    } 


    const handleClientClient = (client: ClientInterface) => {
        setClientView(client)
        setModalViewClient(true)
    }


    useEffect(() => {
        fetchDataClient()
    }, [currentYearStdSelected, currentSectionSelected])


    useEffect(() => {
        fetchDataClient()
    }, [])

    
    return (
        <>

            <PrepareDataStore
                needDataNow
                yearStd
                section
            />


            <ModalViewClient
                modalState={{
                    isOpen: modalViewClient,
                    setOpen: setModalViewClient,
                }}
                client={clientView}
            />


            <LayoutMain
                navbarDarkTheme
                subNavbar
                splashWhiteScreen
                widthFull
                previousRoute={routes.home}
                currentRoute={routes.admin_client}
            >

                <div className='m-5 mb-20 xl:w-[40%] mx-4 xl:mx-auto'>

                    <LabelSelectShortValue
                        label={`ผู้ใช้งานของชั้นปี`}
                        className={`mt-6`} 
                        items={[...(dataCollegian?.yearStd || []), ...['all']]}
                        defaultValue={dataClient?.username.substring(0, 2) || ''}
                        onSelected={handleChangeFilterYear}
                    />

                    
                    <LabelSelectShortValue
                        label={`ตอนเรียน`}
                        className={`mt-2`} 
                        items={[...(dataCollegian?.section?.map(item => item.sec_name) || []), ...['all']]}
                        defaultValue={'all'}
                        onSelected={handleChangeFilterSection}
                    />


                    <div className={`mt-6 text-cyan-800 text-lg text-center`}>
                        กำลังดูผู้ใช้:&nbsp;&nbsp;
                        { currentYearStdSelected === 'all' ? 'ทุกชั้นปี' : `ปี ${currentYearStdSelected}` }&nbsp;,&nbsp;&nbsp;
                        { currentSectionSelected === 'all' 
                            ? 'ทุกตอนเรียน' 
                            : currentSectionSelected.toLocaleLowerCase() === 'other'
                            ? 'ตอนเรียน อื่น ๆ' : `ตอนเรียน ${currentSectionSelected}`
                        }
                        <br />
                        <span className={`text-black/60 text-sm tracking-wide`}>
                            {`( หากมีการทำเปลี่ยนบทบาท หรือ อนุมัติผู้ใช้ ต้องเลือกตัวกรองใหม่อีกครั้ง )`}
                        </span>
                    </div>


                    <div className={`w-full mt-4 flex flex-col justify-stretch items-stretch`}>
                        
                        <Tabs value={onTab} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab 
                                label={`รออนุมัติบัญชี (${listDataClientHoldAccept.length})`} 
                                className='font_kanit'
                                classes={{
                                    selected: 'text-red-700'
                                }}
                            />
                            <Tab 
                                label={`ยืนยันตัวตนแล้ว (${listDataClient.length})`} 
                                className='font_kanit' 
                            />
                        </Tabs>

                        {
                            showDataClient.length !== 0 ? 
                            showDataClient.map((item, index) => {
                                return (
                                    <TransactionBox
                                        key={index}
                                        item={item}
                                        onClick={() => handleClientClient(item)}
                                        className='w-full'
                                        classNameTitle='text-blue-800'
                                        classAmount='text-blue-800'
                                        title={item.fullname || '- ผู้ใช้ยังไม่ได้ตั้งชื่อเต็ม -'}
                                        subTitle={item.username || '- ไม่พบรหัสนักศึกษา -'}
                                        textStatusTnx={
                                            <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                                {item.created_at || 'invalid date'}
                                            </Moment>
                                        }
                                        classNameSubTitle='tracking-wider'
                                        bottomLine={index < showDataClient.length - 1}
                                        amount={`
                                            ${getRoleNameByStatus(item.role)}
                                            ${
                                                currentSectionSelected === 'all' 
                                                ? ( `(
                                                    ${convertSectionNumStrToLetter(item.section!!.toString())}
                                                )`): ''
                                            }
                                        `}
                                    />
                                )
                            })
                            :
                            <p className={`mt-6 text-black/60 text-center tracking-wider text-sm select-none`}>
                                - ไม่มีข้อมูลสำหรับเงื่อนไขนี้ -
                            </p>
                        }
                    </div>

                </div>

            </LayoutMain>
        </>
    )
}