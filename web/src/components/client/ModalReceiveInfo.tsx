import Link from 'next/link'
import { useState } from 'react'
// For validation
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { formReceiveInfoInterface, validationFormReceiveInfoSchema } from '@/utils/helpers/yupFormSchema'
// Components
import { Button } from '@mui/material'
import { Modal } from 'antd'
import TextField from '@mui/material/TextField';

interface propsModalAskToAuth {
    statusReceiveInfo: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    onSubmitForm: ({}: formReceiveInfoInterface) => void,
}


export default function ModalReceiveInfo({ 
    statusReceiveInfo,
    onSubmitForm,
}: propsModalAskToAuth) {

    const [form, setForm] = useState<formReceiveInfoInterface>({
        nickname: '',
        fullname: ''
    })

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationFormReceiveInfoSchema),
        reValidateMode: 'onBlur'
    })
    const { errors } = formState


    const handleChangeDataForm = (slugInput: string, value: string): void => {
        if (slugInput === 'nickname') {
            setForm((prevState: formReceiveInfoInterface) => ({
                ...prevState, 
                nickname: value
            }))
        } else if (slugInput === 'fullname') {
            setForm((prevState: formReceiveInfoInterface) => ({
                ...prevState,
                fullname: value
            }))
        }
    }


    const onSubmit = async () => {
        onSubmitForm(form)
    }


    return (
        <>
            {/* Modal */}
            <Modal 
                title='' 
                open={statusReceiveInfo.isOpen} 
                onCancel={() => statusReceiveInfo.setOpen(false)}
                centered
                closable={false}
                footer={null}
                maskClosable={false}
                keyboard={false}
            >

                {/* Title */}
                <p className={`font_kanit tracking-wide w-full select-none`}>
                    โปรดระบุข้อมูลเกี่ยวกับตัวคุณ&nbsp;&nbsp;(ภาษาไทย)
                </p>
                
                <form action='' onSubmit={handleSubmit(onSubmit)}>
                    {/* Input container */}
                    <div className={`mt-3 flex flex-col gap-y-2.5`}>
                        <TextField
                            label={
                                <span className='font_kanit text-indigo-900'>
                                    ชื่อเล่น
                                </span>
                            }
                            {...register('nickname')}
                            value={form.nickname}
                            error={errors.nickname && true}
                            onChange={(e) => handleChangeDataForm('nickname', e.target.value)}
                            InputProps={{ style: { fontFamily: 'Kanit', fontWeight: 300 }}}
                            variant='filled'
                            className={`w-full select-none`}
                            helperText={`${errors.nickname?.message || ''}`}
                        />
                        <TextField
                            label={
                                <span className='font_kanit text-indigo-900'>
                                    ชื่อ - นามสกุล (ไม่ต้องใส่คำนำหน้า)
                                </span>
                            }
                            {...register('fullname')}
                            value={form.fullname}
                            error={errors.fullname && true}
                            onChange={(e) => handleChangeDataForm('fullname', e.target.value)}
                            InputProps={{ style: { fontFamily: 'Kanit', fontWeight: 300 }}}
                            variant='filled'
                            className={`w-full select-none`}
                            helperText={`${errors.fullname?.message || ''}`}
                        />
                    </div>

                            
                    <Button
                        color='primary'
                        variant='contained' 
                        className={`
                            mt-4 py-4 w-full font_kanit tracking-widests
                        `}
                        size='large'
                        type='submit'
                    >
                        บันทึก
                    </Button>
                </form>

            </Modal>
        
        </>
    )
}