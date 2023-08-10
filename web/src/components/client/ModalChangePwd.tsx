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
import { TextField } from "@mui/material"
import { AuthLocalStorage } from '@/services/localStorage/auth'
import { ClientLocalStorage } from '@/services/localStorage/client'

interface propsModalChangePwd {
    prevModalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    client?: ClientInterface|null,
}


export default function ModalChangePwd({
    prevModalState,
    modalState,
    client = null,
}: propsModalChangePwd) {
    
    const router = useRouter()

    const [form, setForm] = useState({
        old_password: '',
        new_password: ''
    })
    const [errors, setErrors] = useState({
        old_password: false,
        new_password: false
    })


    // stores
    const accessToken = useSelector((state: RootState) => getAccessToken(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    // states
    const [onEdit, setOnEdit] = useState<boolean>(false)


    const handleCloseModal = () => {
        setForm({
            old_password: '',
            new_password: '',
        })
        modalState.setOpen(false)
        prevModalState.setOpen(true)
    }


    const handleChangeDataForm = (slugInput: string, value: string): void => {
        if (slugInput === 'old_password') {
            setForm((prevState: any) => ({
                ...prevState, 
                old_password: value
            }))
        } else if (slugInput === 'new_password') {
            setForm((prevState: any) => ({
                ...prevState, 
                new_password: value
            }))
        }
    }


    const onSignOut = () => {

        AuthLocalStorage.removeAccessToken()
        ClientLocalStorage.removeDataClient();

        dispatch(setAccessToken(null))
        dispatch(setStatusVerifyAuth(false))
        dispatch(setDataClient(null))

        statusAskSignOut.setOpen(false)
        openMessageNoti(messageApi, 'success', ` ออกจากระบบสำเร็จ`)
        setTimeout(() => { router.push(routes.home.path) }, 1000)
    }


    const onSubmitChangePwd = async () => {
        
        if (form.old_password === '' || form.new_password === '') {
            timerSwal({
                icon: 'error',
                title: 'โปรดกรอกข้อมูลให้ครบทุกช่อง',
            })
            return
        } else if (form.old_password === form.new_password) {
            timerSwal({
                icon: 'error',
                title: 'รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม',
            })
            return
        } else if (form.new_password.length < 6) {
            timerSwal({
                icon: 'error',
                title: 'รหัสผ่านใหม่ควรมีอย่างน้อย 6 ตัวอักษร',
            })
            return
        }

        try {
            const res = await AuthServices.changePassword(accessToken, form.old_password, form.new_password)
            console.log('res', res)
            if (res.status === 200) {
                modalState.setOpen(false)
                timerSwal({
                    icon: 'success',
                    title: res.message || 'เปลี่ยนรหัสผ่านสำเร็จ',
                })
                window.location.href = '/auth'
                return
            } else {
                throw new Error('Error')
            }
        } catch (err: any) {
            timerSwal({
                icon: 'error',
                title: err?.response?.data?.message || 'เกิดข้อผิดพลาด, ไม่สามารถเปลี่่ยนรหัสผ่านได้ในขณะนี้',
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
                onCancel={handleCloseModal}
                footer={null}
                className={`my-10`}
            >
                <div className={`font_kanit relative w-ful w-9/12 mx-auto`}>
                    
                    <p className="text-center text-lg my-4 ">เปลี่ยนรหัสผ่าน</p>
                    <TextField
                        value={form.old_password}
                        error={errors.old_password && true}
                        onChange={(e) => handleChangeDataForm('old_password', e.target.value)}
                        label={!errors.old_password ? `รหัสผ่านเดิม` : `โปรดระบุรหัสผ่านเดิม`} 
                        variant="standard"
                        className={`w-full select-none`}
                    />
                    <TextField
                        value={form.new_password}
                        error={errors.new_password && true}
                        onChange={(e) => handleChangeDataForm('new_password', e.target.value)}
                        label={!errors.new_password ? `รหัสผ่านใหม่` : `โปรดระบุรหัสผ่านใหม่`} 
                        variant="standard" 
                        className={`w-full select-none mt-4`}
                    />

                    <div className={`flex-center flex-col w-full mt-6`}>
                        <Button
                            onClick={onSubmitChangePwd}
                            type={'primary'}
                            className='mt-1 mb-2 font_kanit w-full'
                        >
                            เปลี่ยนรหัสผ่าน
                        </Button>
                        <Button
                            onClick={handleCloseModal}
                            className='mt-1 mb-2 font_kanit w-full'
                        >
                            ยกเลิก
                        </Button>
                    </div>

                </div>
            </Modal>
        
        
        </>
    )
    
}