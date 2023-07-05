import Link from "next/link"

import Pagination from "@/components/Pagination"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Tag, message } from "antd"
import { openMessageNoti, subString } from '@/utils/helpers/functions'
import { routes } from "@/data/dict/routes_dict"
import { Button } from "@mui/material"
import RowLabelValue from "@/components/RowLabelValue"
import { billDict, getBillStageNameByStatusNum } from "@/data/dict/bill_dict"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import { getAccessToken } from "@/store/slices/authSlice"
import { getDataClient } from "@/store/slices/clientSlice"
import { getDataBill, setDataBill, setPaginationBill } from "@/store/slices/billSlice"
import { roles } from "@/data/dict/role_dict"
import { RootState } from "@/store"
import { BillServices } from "@/services/api/bill"
import { AxiosError, AxiosResponse } from "axios"
import { isMobile } from "react-device-detect"
import { useEffect } from "react"
import Moment from "react-moment"
import 'moment-timezone'



interface propsInterface {
    className?: string
}


export default function AccordionReportPayment({
    className = ''
}: propsInterface) {

    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage()
    // Stores
    const dispatch = useDispatch()
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const dataBill = useSelector((state: RootState) => getDataBill(state))
    const accessStaff = dataClient?.role === roles.admin.level
        || dataClient?.role === roles.chairman.level
        || dataClient?.role === roles.secretary.level
    const paginationBill = useSelector((state: RootState) => state.bill.pagination)
    // States
    // no-state

    useEffect(() => {
        handleChangePage(1)
    }, [])


    const handleChangePage = async (page: number) => {
        await BillServices.getBill(accessToken, page)
            .then((res: AxiosResponse|any) => {
                dispatch(setDataBill(res.data.data))
                dispatch(setPaginationBill(res.data.pagination))
            })
            .catch((err: AxiosError|any) => {
                openMessageNoti(
                    messageApi,
                    err.response?.data?.status_tag || 'error',
                    err.response?.data?.message || 'เกิดข้อผิดพลาด, ไม่สามารถเปลี่ยนหน้าได้',
                )
            })
    }



    return (
        <>
            <div className={`w-full ${className}`}>
                {
                    dataBill?.map((item, index) => {
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
                                                            (
                                                                item.recipient.totalCount !== 0 &&
                                                                item.recipient.paid.count !== 0 &&
                                                                item.recipient.totalCount === item.recipient.paid.count
                                                            ) ? `✔ `
                                                            : (item.status === billDict.appove.status) && `🕓 `
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
                                                        item.status === billDict.hold.status 
                                                            ? `default`
                                                        : item.status === billDict.appove.status 
                                                            ? `magenta-inverse`
                                                        : item.status === billDict.close.status 
                                                            ? `purple-inverse`
                                                        : item.status === billDict.cancel.status 
                                                            ? `red-inverse`
                                                            : ``
                                                    } 
                                                    className={`px-1.5`}
                                                >
                                                    { getBillStageNameByStatusNum(item.status) }
                                                </Tag>
                                            </span>
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={`w-full pb-2.5 flex flex-col justify-center`}>
                                        
                                        <div className={`w-full -mt-3 mb-4 h-[0.1rem] bg-black/20`} />

                                        <div className={`w-11/12 flex flex-col gap-y-4 mx-auto pb-2.5 font_kanit`}>
                                            
                                            {
                                                (
                                                    item.recipient.totalCount !== 0 &&
                                                    item.recipient.paid.count !== 0 &&
                                                    item.recipient.totalCount === item.recipient.paid.count
                                                ) &&
                                                <p className={`text-center py-2`}>
                                                    - ได้รับการชำระครบทุกคนแล้ว -
                                                </p>
                                            }
                                            <RowLabelValue
                                                className={`text-gray-800`}
                                                label={`ตัวชี้วัด`}
                                                value={`${item.recipient.paid.count} / ${item.recipient.totalCount || 0}`}
                                            />
                                            <RowLabelValue
                                                className={`text-blue-700`}
                                                label={`ผู้ได้รับบิลนี้ทั้งหมด`}
                                                value={`${item.recipient.totalCount || 0} คน`}
                                            />
                                            <RowLabelValue
                                                className={`text-green-700`}
                                                label={`ชำระแล้ว`}
                                                value={`${item.recipient.paid.count || 0} คน`}
                                            />
                                            <RowLabelValue
                                                className={`text-orange-700/90`}
                                                label={`รอตรวจสอบ`}
                                                value={`${item.recipient.hold_check.count || 0} คน`}
                                            />
                                            <RowLabelValue
                                                className={`text-red-700/80`}
                                                label={`ยังไม่ชำระ`}
                                                value={`${item.recipient.hold.count || 0} คน`}
                                            />
                                            <RowLabelValue
                                                className={`text-gray-700/90`}
                                                label={`ไม่ผ่านชำระ (รอชำระใหม่)`}
                                                value={`${item.recipient.callback.count || 0} คน`}
                                            />
                                        </div>

                                        
                                        <Link
                                            href={routes.admin_budget_payment_validation.path + `?bill_id=${item.id}`}
                                            className={`mx-auto w-11/12`}
                                        >
                                            <Button
                                                variant="contained"
                                                className={`
                                                    w-full mx-auto mt-2.5 font_kanit
                                                    tracking-wider font-normal
                                                `}
                                            >
                                                ตรวจสอบแบบละเอียด
                                            </Button>
                                        </Link>

                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        )    
                    })
                    || <span className={`mt-8 flex-center`}>
                        - ไม่มีข้อมูล -
                    </span>
                }

                {
                    dataBill &&
                    <Pagination 
                        className={`mt-4`} 
                        pageCount={paginationBill?.pageSize || 1}
                        currentPage={paginationBill?.currentPage || 1}
                        onPage={(onPage) => handleChangePage(onPage)}
                    />
                }

            </div>
        </>
    )
}
