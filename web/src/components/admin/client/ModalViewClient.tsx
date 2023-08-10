import { ClientInterface } from "@/interfaces/client"
import { Button } from "@mui/material"
import { Modal } from "antd"
import ColTitleValue from "@/components/ColLabelValue"
import Moment from "react-moment"
import 'moment-timezone'
import { swal, timerSwal } from "@/utils/sweetAlert"
import { AuthServices } from "@/services/api/auth"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { getAccessToken } from "@/store/slices/authSlice"
import { useRouter } from "next/router"
import { routes } from "@/data/dict/routes_dict"
import { convertSectionNumStrToLetter } from "@/data/dict/section_dict"
import { getRoleNameByStatus, roles } from "@/data/dict/role_dict"
import { getDataClient } from "@/store/slices/clientSlice"


interface propsModalViewClient {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    client?: ClientInterface|null,
}


export default function ModalViewClient({ 
    modalState,
    client = null,
}: propsModalViewClient) {
    
    const router = useRouter()


    // stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))

    const handleAcceptClient = async () => {

        const alert = await swal.fire({
            icon: 'warning',
            title: 'ต้องการอนุมัติใช้งาน ?',
            text: 'ผู้ใช้งานจะสามารถเข้าใช้งานระบบได้ทันที',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'อนุมัติ',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            input: 'select',
            inputOptions: {
              'it': 'สาขา IT',
              'other': 'สาขาอื่น'
            },
        })

        if (!alert.isConfirmed) return

        try {
            await AuthServices.acceptAccount(
                accessToken,
                client?.id || '',
                alert?.value === 'it' ? 'IT' : 'Other'
            )
            modalState.setOpen(false)
            timerSwal({
                icon: 'success',
                title: 'อนุมัติใช้งานสำเร็จ',
                subTitle: 'ผู้ใช้งานสามารถเข้าใช้งานระบบได้ทันที',
            })
            router.push(routes.home.path + '?sendBack=' + routes.admin_client.path)
        } catch (err) {
            timerSwal({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                subTitle: 'ไม่สามารถอนุมัติใช้งานได้ในขณะนี้, โปรดลองใหม่อีกครั้งในภายหลัง',
            })
        }
        
    }


    const handleChangeRoleClient = async () => {


        const getInputOption = async () => {
            
            if (dataClient?.role === roles.admin.level) {
                return {
                    '0': 'ผู้ใช้งานทั่วไป',
                    '1': 'ผู้ดูแลระบบ',
                    '2': 'ประธาน',
                    '3': 'เลขา',
                    '4': 'เหรัญญิก',
                    '5': 'ทีมบริหาร',
                }
            } else if (dataClient?.role === roles.chairman.level) {
                return {
                    '0': 'ผู้ใช้งานทั่วไป',
                    '2': 'ประธาน',
                    '3': 'เลขา',
                    '4': 'เหรัญญิก',
                    '5': 'ทีมบริหาร',
                }
            } else if (dataClient?.role === roles.secretary.level) {
                return {
                    '0': 'ผู้ใช้งานทั่วไป',
                    '3': 'เลขา',
                    '4': 'เหรัญญิก',
                    '5': 'ทีมบริหาร',
                }
            } else if (dataClient?.role === roles.treasurer.level) {
                return {
                    '0': 'ผู้ใช้งานทั่วไป',
                    '4': 'เหรัญญิก',
                    '5': 'ทีมบริหาร',
                }
            } else if (dataClient?.role === roles.CEOs.level) {
                return {
                    '0': 'ผู้ใช้งานทั่วไป',
                    '5': 'ทีมบริหาร',
                }
            }

        }

        
        const alert = await swal.fire({
            icon: 'warning',
            title: 'ต้องการอนุมัติใช้งาน ?',
            text: 'ผู้ใช้งานจะสามารถเข้าใช้งานระบบได้ทันที',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'อนุมัติ',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            input: 'select',
            inputOptions: await getInputOption()
        })

        if (!alert.isConfirmed) return

        try {
            await AuthServices.acceptAccount(
                accessToken,
                client?.id || '',
                alert?.value === 'it' ? 'IT' : 'Other'
            )
            modalState.setOpen(false)
            timerSwal({
                icon: 'success',
                title: 'อนุมัติใช้งานสำเร็จ',
                subTitle: 'ผู้ใช้งานสามารถเข้าใช้งานระบบได้ทันที',
            })
            router.push(routes.home.path + '?sendBack=' + routes.admin_client.path)
        } catch (err) {
            timerSwal({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                subTitle: 'ไม่สามารถอนุมัติใช้งานได้ในขณะนี้, โปรดลองใหม่อีกครั้งในภายหลัง',
            })
        }
    
    }


    return (
        <>

            <Modal
                title='' 
                open={modalState.isOpen} 
                centered
                closable={false}
                onCancel={() => client?.role === roles.guest.level && modalState.setOpen(false)}
                footer={null}
                className={`my-10`}
            >
                <div className={`pb-2 font_kanit flex-center flex-col`}>

                    <p className={`text-lg flex-center flex-col`}>
                        ข้อมูลผู้ใช้งาน
                    </p>
                    <div className="px-2 w-full flex flex-col gap-y-4 mt-6">
                        <ColTitleValue
                            label={'ชื่อผู้ใช้งาน / รหัสนักศึกษา'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={client?.username || '-'}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        <ColTitleValue
                            label={'ตอนเรียน'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={convertSectionNumStrToLetter(client?.section?.toString() || null)}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        {
                            client?.role !== roles.guest.level &&
                            <ColTitleValue
                                label={'สาขา'}
                                labelClassName="text-blue-800"
                                valueClassName="text-black/80"
                                value={client?.branch || '-'}
                                className="w-full gap-y-0"
                                disableItemsCenter
                            />
                        }
                        {
                            client?.role !== roles.guest.level &&
                        
                            <ColTitleValue
                                label={'บทบาท'}
                                labelClassName="text-blue-800"
                                valueClassName="text-black/80"
                                value={`${getRoleNameByStatus(client?.role)}`}
                                className="w-full gap-y-0"
                                disableItemsCenter
                            />
                        }
                        {
                            (
                                client?.role !== roles.guest.level 
                                && client?.role !== roles.member.level
                                && client?.role !== roles.treasurer.level
                            ) &&
                            <>
                                <ColTitleValue
                                    label={'อีเมลล์'}
                                    labelClassName="text-blue-800"
                                    valueClassName="text-black/80"
                                    value={client?.email || '-'}
                                    className="w-full gap-y-0"
                                    disableItemsCenter
                                />
                                <ColTitleValue
                                    label={'ชื่อเต็ม'}
                                    labelClassName="text-blue-800"
                                    valueClassName="text-black/80"
                                    value={client?.fullname || '-'}
                                    className="w-full gap-y-0"
                                    disableItemsCenter
                                />
                                <ColTitleValue
                                    label={'คำอธิบาย'}
                                    labelClassName="text-blue-800"
                                    valueClassName="text-black/80"
                                    value={client?.description || '-'}
                                    className="w-full gap-y-0"
                                    disableItemsCenter
                                />
                            </>
                        }
                        <ColTitleValue
                            label={'เข้าร่วมเมื่อ'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={<>
                                <Moment format="DD/MM/YYYY . HH:mm" tz="Asia/Bangkok">
                                    {client?.created_at || 'invalid date'}
                                </Moment>
                            </>}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                    </div>
                    
                    <div className={`mt-6 w-full`}>
                        {
                            client?.role === roles.guest.level &&
                            <Button
                                onClick={handleAcceptClient}
                                variant="contained" 
                                className={`
                                    w-[96%] font_kanit
                                    tracking-wider font-light text-orginal   
                                `}
                            >
                                อนุมัติใช้งานระบบ
                            </Button>
                        }

                        {
                            client?.role !== roles.guest.level &&
                            <Button
                                onClick={handleChangeRoleClient}
                                variant="contained" 
                                className={`
                                    w-[96%] font_kanit
                                    tracking-wider font-light text-orginal   
                                `}
                            >
                                เปลี่ยนบทบาทผู้ใช้
                            </Button>
                        }
                        
                        <Button
                            onClick={() => {
                                modalState.setOpen(false)
                            }}
                            variant="contained" 
                            className={`
                                w-[96%] h-9 mt-2 font_kanit bg-[#585858]
                                tracking-wider font-light text-orginal   
                            `}
                        >
                            ปิด
                        </Button>
                    </div>

                </div>
            </Modal>
        
        
        </>
    )
    
}