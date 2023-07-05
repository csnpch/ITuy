import Link from 'next/link'

import Pagination from '@/components/Pagination'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Tag, message } from 'antd'
import { subString } from '@/utils/helpers/functions'
import { Button, Tab, Tabs } from '@mui/material'
import { useSelector } from 'react-redux'
import { getAccessToken } from '@/store/slices/authSlice'
import { getDataClient } from '@/store/slices/clientSlice'
import { roles } from '@/data/dict/role_dict'
import { RootState } from '@/store'
import { isMobile } from 'react-device-detect'
import { useEffect, useState } from 'react'
import { TnxServices } from '@/services/api/transaction'
import { transactionInterface } from '@/interfaces/transaction'
import { swal, timerSwal } from '@/utils/sweetAlert'
import { paginationInterface } from '@/interfaces/share/pagination'
import { getTnxStateNameByStatusNum, tnxDict } from '@/data/dict/transactionDict'
import ColTitleValue from '@/components/ColLabelValue'
import { useRouter } from 'next/router'
import Moment from "react-moment"
import 'moment-timezone'
import { routes } from '@/data/dict/routes_dict'



interface propsInterface {
    className?: string
}


export default function AccordionReportTnx({
    className = ''
}: propsInterface) {

    const router = useRouter()
    // Stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const accessStaff = dataClient?.role === roles.admin.level
        || dataClient?.role === roles.chairman.level
        || dataClient?.role === roles.secretary.level
    // States
    const [dataTnx, setDataTnx] = useState<transactionInterface[]|null>(null)
    const [paginateTnx, setPaginateTnx] = useState<paginationInterface>()

    useEffect(() => {
        handleChangePage(1)
    }, [])


    const handleChangePage = async (page: number) => {
        try {
            const res: any = await TnxServices.getTnxAll(accessToken, page)
            console.log('res', res)
            setPaginateTnx(res.data.pagination)
            setDataTnx(res.data.transactions)
        } catch (_: any) {
            timerSwal({
                title: `เกิดข้อผิดพลาด`,
                subTitle: `ไม่สามารถดึงข้อมูลธุรกรรมได้ในขณะนี้`,
                icon: `error`,
            })
        }
    }


    const handleApproveTnx = async (id: string) => {

        swal.fire({
            title: `อนุมัติงบประมาณ`,
            text: `คุณต้องการอนุมัติงบประมาณนี้ใช่หรือไม่ ?`,
            icon: `warning`,
            showCancelButton: true,
            confirmButtonText: `ใช่, อนุมัติงบประมาณ`,
            cancelButtonText: `ยกเลิก`,
            cancelButtonColor: `#d33`,
            confirmButtonColor: `#3085d6`,
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res: any = await TnxServices.approveTnx(accessToken, id)
                    timerSwal({
                        icon: 'success',
                        title: res.message,
                    })
                    setTimeout(() => {
                        router.push(routes.budget.path + '?sendBack=' + routes.admin_budget_transaction.path)
                    }, 1800)
                } catch (_: any) { 
                    timerSwal({
                        title: `เกิดข้อผิดพลาด`,
                        subTitle: `ไม่สามารถดึงอนุมัติงบประมาณได้ในขณะนี้`,
                        icon: `error`,
                    })
                }
            }
        })
        
    }

    const handleRejectTnx = async (id: string) => {


        swal.fire({
            title: `ไม่อนุมัติงบประมาณ`,
            text: `คุณต้องการไม่อนุมัติงบประมาณนี้ใช่หรือไม่ ?`,
            icon: `warning`,
            showCancelButton: true,
            confirmButtonText: `ใช่, ไม่อนุมัติงบประมาณ`,
            cancelButtonText: `ยกเลิก`,
            cancelButtonColor: `#d33`,
            confirmButtonColor: `#3085d6`,
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res: any = await TnxServices.rejectTnx(accessToken, id)
                    timerSwal({
                        icon: 'success',
                        title: res.message,
                    })       
                    setTimeout(() => {
                        router.push(routes.budget.path + '?sendBack=' + routes.admin_budget_transaction.path)
                    }, 1800)
                } catch (_: any) { 
                    timerSwal({
                        title: `เกิดข้อผิดพลาด`,
                        subTitle: `ไม่สามารถดึงอนุมัติธุรกรรมได้ในขณะนี้`,
                        icon: `error`,
                    })
                }
            }
        })
        
    }

    return (
        <>

            <div className={`w-full ${className}`}>
                {
                    dataTnx ?
                    dataTnx.map((item, index) => {
                        return (
                            <Accordion key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <div className='w-11/12 py-1'>
                                        <div className={`w-full flex flex-row items-center justify-between font_kanit`}>
                                            <div className={`w-full flex flex-col gap-y-1`}>
                                                <p className={`
                                                    tracking-wide
                                                `}>
                                                    <span>
                                                        {
                                                            item.status === tnxDict.hold.status 
                                                            ? `🕓 ` 
                                                            : item.status === tnxDict.appove.status
                                                            ? `✔ `
                                                            : '' 
                                                        }
                                                    </span>
                                                    { subString(item.title, isMobile ? 24 : 100, ` ...`) }
                                                </p>
                                                <p className={`text-xs text-black/60`}>
                                                    <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                                        {item.created_at || 'invalid date'}
                                                    </Moment>
                                                </p>
                                            </div>
                                            <span className={`font_kanit`}>
                                                <Tag 
                                                    color={
                                                        item.status === tnxDict.hold.status 
                                                            ? `default`
                                                        : item.status === tnxDict.appove.status 
                                                            ? `purple-inverse`
                                                        : item.status === tnxDict.disapprove.status 
                                                            ? `red-inverse` : ''
                                                    } 
                                                    className={`px-1.5`}
                                                >
                                                    { getTnxStateNameByStatusNum(item.status) }
                                                </Tag>
                                            </span>
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={`w-full pb-2.5 flex flex-col justify-center`}>
                                        
                                        <div className={`w-full -mt-3 mb-4 h-[0.1rem] bg-black/20`} />

                                        <div className={`w-11/12 gap-y-6 mx-auto flex flex-col pb-2.5 font_kanit`}>
                                            <ColTitleValue
                                                disableItemsCenter
                                                className={`text-gray-800`}
                                                labelClassName='text-red-700'
                                                label={`งบประมาณที่ขอเบิก`}
                                                value={'฿ ' + item.amount.toString() || '-'}
                                            />
                                            <Link
                                                href={item.link_evidence || ''}
                                                target='_blank'
                                            >
                                                <ColTitleValue
                                                    disableItemsCenter
                                                    className={`text-gray-800`}
                                                    labelClassName='text-blue-800'
                                                    label={`หลักฐานเบิกงบประมาณ`}
                                                    value={'🔗 ' + item.link_evidence || '-'}
                                                />
                                            </Link>
                                            <ColTitleValue
                                                disableItemsCenter
                                                className={`text-gray-800`}
                                                labelClassName='text-blue-800'
                                                label={`รายละเอียด`}
                                                value={item.description || '-'}
                                            />
                                            <ColTitleValue
                                                disableItemsCenter
                                                className={`text-gray-800`}
                                                labelClassName='text-blue-800'
                                                label={`ผู้สร้าง`}
                                                value={item.owner_name || '-'}
                                            />
                                        </div>

                                        
                                        {
                                            (
                                                accessStaff
                                                && item.status === tnxDict.hold.status
                                            ) &&
                                            <>
                                                <Button
                                                    onClick={() => handleApproveTnx(item.tnx_id)}
                                                    variant='contained'
                                                    className={`
                                                        w-11/12 mx-auto mt-2.5 font_kanit
                                                        tracking-wider font-normal
                                                    `}
                                                >
                                                    อนุมัติงบประมาณ
                                                </Button>

                                                <Button
                                                    onClick={() => handleRejectTnx(item.tnx_id)}
                                                    variant='contained'
                                                    className={`
                                                        w-11/12 mx-auto mt-2.5 font_kanit
                                                        tracking-wider font-normal bg-red-800/80 
                                                        hover:bg-red-800/90 active:bg-red-800/90
                                                    `}
                                                >
                                                    ไม่อนุมัติงบประมาณ
                                                </Button>
                                            </>
                                        }

                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        )    
                    })
                    : <p className='text-center mt-8 text-sm'>
                        - ไม่มีข้อมูลธุรกรรมงบประมาณ -
                    </p>
                }

                {
                    dataTnx &&
                    <Pagination 
                        className={`mt-4`} 
                        pageCount={paginateTnx?.pageSize || 1}
                        currentPage={paginateTnx?.currentPage || 1}
                        onPage={(onPage) => handleChangePage(onPage)}
                    />
                }

            </div>
        </>
    )
}
