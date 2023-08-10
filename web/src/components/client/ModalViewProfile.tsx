import configs from "@/configs"
import { ClientInterface } from "@/interfaces/client"
import { moneyFormat } from "@/utils/helpers/functions"
import { Modal, Button } from "antd"
import Link from "next/link"
import ColTitleValue from "@/components/ColLabelValue"
import RowTiteValue from "@/components/RowLabelValue"
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
import { getRoleNameByStatus, levels, roles } from "@/data/dict/role_dict"
import { getDataClient } from "@/store/slices/clientSlice"
import mock_img_profile from '@/assets/imgs/mock_img_profile.svg'
import Image from "next/image"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { useState } from "react"
import ModalChangePwd from './ModalChangePwd'


interface propsModalViewProfile {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    client?: ClientInterface|null,
}


export default function ModalViewProfile({ 
    modalState,
    client = null,
}: propsModalViewProfile) {
    
    const router = useRouter()


    // stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    // states
    const [onEdit, setOnEdit] = useState<boolean>(false)
    const [modalChangePwd, setModalChangePwd] = useState<boolean>(false)


    return (
        <>


            <ModalChangePwd 
                prevModalState={modalState}
                modalState={{
                    isOpen: modalChangePwd,
                    setOpen: setModalChangePwd
                }}
                client={dataClient}
            />


            <Modal
                title='' 
                open={modalState.isOpen} 
                centered
                closable={false}
                onCancel={() => {
                    modalState.setOpen(false)
                }}
                footer={null}
                className={`my-10`}
            >
                <div className={`font_kanit relative`}>
                    <div 
                        onClick={() => modalState.setOpen(false)}
                        className={`absolute right-0 top-0 text-2xl text-black/50 cursor-pointer hover:text-black rounded-full flex-center`}>
                        <AiOutlineCloseCircle />
                    </div>
                      <div className={`w-full flex-center`}>
                        <Image
                            src={mock_img_profile}
                            alt="#"
                            className="mt-4 mx-auto"
                        />
                    </div>
                    <div className="px-2 w-full flex flex-col gap-y-4 mt-7">
                        <ColTitleValue
                            label={'ชื่อผู้ใช้งาน / รหัสนักศึกษา'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={client?.username || '-'}
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
                                label={'สาขา'}
                                labelClassName="text-blue-800"
                                valueClassName="text-black/80"
                                value={client?.branch || '-'}
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
                        <ColTitleValue
                            label={'บทบาท'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={getRoleNameByStatus(client.role)}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        <ColTitleValue
                            label={'วันที่เข้าร่วม'}
                            labelClassName="text-blue-800"
                            valueClassName="text-black/80"
                            value={<>
                                <Moment format="DD/MM/YYYY" tz="Asia/Bangkok">
                                    {client?.created_at || 'invalid date'}
                                </Moment>
                            </>}
                            className="w-full gap-y-0"
                            disableItemsCenter
                        />
                        <Button
                            className='mt-1 mb-2 font_kanit'
                            onClick={() => {
                                modalState.setOpen(false)
                                setModalChangePwd(true)
                            }}
                        >
                            เปลี่ยนรหัสผ่าน
                        </Button>
                    </div>

                    <p className="text-xs text-center mt-4 text-black/60">- หากต้องการแก้ไขข้อมูล -</p>
                    <p className="text-xs text-center mt-1.5 text-black/60">กรุณาติดต่อทีมบริหารในรุ่นของท่าน</p>

                </div>
            </Modal>
        
        
        </>
    )
    
}