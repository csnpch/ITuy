import Link from "next/link"
import Pagination from "@/components/Pagination"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Tag, message } from "antd"
import { moneyFormat, openMessageNoti, subString } from '@/utils/helpers/functions'
import { Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { getDataClient } from "@/store/slices/clientSlice"
import { roles } from "@/data/dict/role_dict"
import RowLabelValue from "@/components/RowLabelValue"
import { getDataBill, setDataBill, setPaginationBill, updateStatusBill } from "@/store/slices/billSlice"
import { BillInterface } from "@/interfaces/bill"
import { billDict, getBillStageNameByStatusNum } from "@/data/dict/bill_dict"
import { BillServices } from "@/services/api/bill"
import { getAccessToken } from "@/store/slices/authSlice"
import { AxiosError, AxiosResponse } from "axios"
import { isMobile } from "react-device-detect"
import { useRouter } from "next/router"
import { routes } from "@/data/dict/routes_dict"
import { swal } from "@/utils/sweetAlert"
import Moment from "react-moment"
import 'moment-timezone'



interface propsInterface {
    className?: string
}


export default function AccordionReportBill({
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

    const onActionBill = async (id: string, status: number|null) => {
        if (dataBill?.length === 0) return

        const billAction = dataBill?.filter((item: BillInterface) => item.id === id)[0]
        if (!billAction) return
        
        let title: string = ''
        let subTitle: string = ''
        if (status === billDict.cancel.status) {
            title = `ยกเลิกบิล`
            subTitle = `ต้องการยกเลิก [ ${billAction.title} ] ใช่หรือไม่`
        } else if (status === billDict.close.status) {
            title = `ปิดบิล`
            subTitle = `ต้องการปิด [ ${billAction.title} ] ใช่หรือไม่`
        } else if (status === billDict.appove.status) {
            title = `อนุมัติบิล`
            subTitle = `ต้องการอนุมัติ [ ${billAction.title} ] ใช่หรือไม่`
        }

        swal.fire({
            title: `${title}`,
            html: <p>{`${subTitle} ?`}</p>,
            icon: 'info',
            customClass: 'text-xs xl:text-sm',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await BillServices.changeStatusBill(accessToken, status, id)
                    .then((res: AxiosResponse|any) => {
                        router.push(routes.budget.path + '?sendBack=' + routes.admin_budget_bill.path)
                        openMessageNoti(
                            messageApi,
                            res.data.status_tag,
                            res.data.message,
                        )
                        dispatch(updateStatusBill({
                            id: id,
                            status: status
                        }))
                    })
                    .catch((err: AxiosError|any) => {
                        openMessageNoti(
                            messageApi,
                            err.response?.data?.status_tag || 'error',
                            err.response?.data?.message || 'เกิดข้อผิดพลาด, ไม่สามารถเปลี่ยนสถานะบิลได้',
                        )
                    })
            }
        })

    }


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
            { contextHolder }

            <div className={`w-full ${className}`}>
                {
                    Array.isArray(dataBill) &&
                    dataBill.map((item: BillInterface, index) => {
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
                                                    { subString(item.title || '-', isMobile ? 24 : 200, ` ...`) }
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
                                                            ? `#444`
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


                                            <RowLabelValue 
                                                className={`text-black`}
                                                label={`ยอดเงินที่เรียกเก็บ`}
                                                value={moneyFormat(item.amount)}
                                                isNumber
                                            />

                                            <RowLabelValue 
                                                className={`text-red-600`}
                                                label={`ได้รับบิลทั้งหมด`}
                                                // value={`${item.}`}
                                                value={`${item.recipient.totalCount || '0'} คน`}
                                            />

                                            <RowLabelValue 
                                                className={`text-blue-800`}
                                                label={`จ่ายบิลไปที่`}
                                                value={`ปี ${item.target || '-'}`}
                                            />

                                            <RowLabelValue 
                                                className={`text-purple-800`}
                                                label={`ผู้สร้างบิล`}
                                                value={item.owner_name || '-'}
                                            />
                                            
                                        </div>
                                        
                                        {
                                            (
                                                item.status !== billDict.close.status
                                                && item.status !== billDict.cancel.status
                                            ) &&
                                            <>
                                                {
                                                    (
                                                        item.status !== billDict.appove.status 
                                                        && accessStaff
                                                    ) &&
                                                    <Button
                                                        onClick={() => onActionBill(item.id, billDict.appove.status)}
                                                        variant="contained" 
                                                        className={`
                                                            w-11/12 mx-auto mt-2.5 font_kanit
                                                            tracking-wider font-normal
                                                        `}
                                                    >
                                                        อนุมัติบิลเรียกเก็บเงิน
                                                    </Button>
                                                }
                                                {/* After allow */}
                                                {
                                                    (
                                                        item.status !== billDict.close.status
                                                        && item.status !== billDict.hold.status
                                                        && item.status !== billDict.cancel.status
                                                    ) && 
                                                    <Button
                                                        onClick={() => onActionBill(item.id, billDict.close.status)}
                                                        variant="contained" 
                                                        className={`
                                                            w-11/12 mx-auto mt-2.5 font_kanit
                                                            tracking-wider font-normal bg-cyan-700
                                                        `}
                                                    >
                                                        ปิดบิลเรียกเก็บเงิน
                                                    </Button>
                                                }

                                                <Button
                                                    onClick={() => onActionBill(item.id, billDict.cancel.status)}
                                                    variant="contained" 
                                                    className={`
                                                        w-11/12 mx-auto mt-2.5 font_kanit
                                                        tracking-wider font-normal bg-red-700/80
                                                    `}
                                                >
                                                    {
                                                        item.status === billDict.appove.status 
                                                        ? 'ยกเลิกบิล' 
                                                        : dataClient?.role !== roles.treasurer.level 
                                                        ? 'ไม่อนุมัติ' : 'ยกเลิกบิล'
                                                    }
                                                </Button>
                                            </>        
                                        }
                                    
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        )    
                    })
                }

            </div>

            <Pagination 
                className={`mt-4`} 
                pageCount={paginationBill?.pageSize || 1}
                currentPage={paginationBill?.currentPage || 1}
                onPage={(onPage) => handleChangePage(onPage)}
            />
        </>
    )
}
