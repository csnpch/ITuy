import { useEffect, useState } from 'react'
// Yup validate form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { 
    formAddPaymentMethodInterface, 
    validationFormAddPaymentMethodSchema 
} from '@/utils/helpers/yupFormSchema'
// Components
import { Modal, message } from 'antd'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import MultipleSelectChip from '@/components/MultipleSelectChip'
// Stores
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getDataCollegian } from '@/store/slices/collegianReducer'
// Others
import { openMessageNoti } from '@/utils/helpers/functions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { MenuItem, Select } from '@mui/material'



interface propsModalAddPaymentMethod {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    onSubmitForm?: (actionType: string, {}: formAddPaymentMethodInterface) => void,
    resetForm?: () => void,
}

export default function ModalAddPaymentMethod({ 
    modalState,
    onSubmitForm = () => {},
    resetForm = () => {},
}: propsModalAddPaymentMethod) {
    // Stores
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    // States
    const [messageApi, contextHolder] = message.useMessage()
    const [form, setForm] = useState<formAddPaymentMethodInterface>({
        target: '',
        promptpay: '',
        method_identity: '',
        reserve_identity: '',
    })

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationFormAddPaymentMethodSchema),
        reValidateMode: 'onBlur'
    })
    const { errors } = formState


    // trigger reset form
    useEffect(() => {
        setForm({
            target: '',
            promptpay: '',
            method_identity: '',
            reserve_identity: '',
        })
    }, [resetForm])


    const handleChangeDataForm = (key: string, value: string): void => {
        setForm((prevState: formAddPaymentMethodInterface) => ({
            ...prevState,
            [key]: value
        }))
    }


    const handleSubmitForm = () => {
        if (form.target === '') {
            openMessageNoti(
                messageApi,
                'error',
                'โปรดเลือกช่องทางชำระสำหรับชั้นปี'
            )
            return
        }
        onSubmitForm('insert', form)
    }


    return (
        <>
            { contextHolder }


            <Modal 
                title='' 
                open={modalState.isOpen} 
                centered
                closable={false}
                footer={null}
                className={`my-10`}
            >

                <form
                    action='#'
                    className={`pb-2 font_kanit flex-center flex-col`}
                    onSubmit={handleSubmit(handleSubmitForm)}
                >

                    <span className={`text-lg tracking-wide text-[#0014C7]`}>
                        เพิ่มช่องทางชำระเงิน
                    </span>

                    <div 
                        className={`w-[98%] mt-6 flex-center flex-col gap-y-5`}
                    >
                        {/* Target Year Bill */}
                        <FormControl fullWidth>
                            <InputLabel>
                                <span className={`font_kanit`}>ช่องทางชำระสำหรับชั้นปี *</span>
                            </InputLabel>
                            <Select
                                {...register('target')}
                                value={form.target}
                                error={!!errors.target}
                                label='ช่องทางชำระสำหรับชั้นปี__'
                                className={`w-full px-4 text-blue-800`}
                                onChange={(e) => handleChangeDataForm('target', e.target.value)}
                            
                            >
                                {
                                    dataCollegian?.yearStd?.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item}>
                                                { item } 
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>



                        <div className={`w-full flex flex-col gap-y-1`}>
                            <span>หมายเลขพร้อมเพย์ *</span>
                            <TextField
                                {...register('promptpay')}
                                value={form.promptpay}
                                defaultValue={form.promptpay}
                                type='number'
                                variant="outlined"
                                placeholder={`เบอร์โทร หรือ เลขบัตรประชาชน`}
                                className='font_kanit'
                                InputProps={{ className: 'font_kanit' }}
                                fullWidth
                                multiline
                                error={!!errors.promptpay}
                                helperText={`${errors.promptpay?.message || ''}`}
                                onChange={(e) => handleChangeDataForm('promptpay', e.target.value)}
                            />
                        </div>
                        
                        <div className={`w-full flex flex-col gap-y-1`}>
                            <span>ผู้ครอบครองบัญชี *</span>
                            <TextField
                                {...register('method_identity')}
                                value={form.method_identity}
                                defaultValue={form.method_identity}
                                variant="outlined"
                                placeholder={`นางสาวสมศรี ศรีประทุม (เหรัญญิก)`}
                                className='font_kanit'
                                InputProps={{ className: 'font_kanit' }}
                                fullWidth
                                multiline
                                error={!!errors.method_identity}
                                helperText={`${errors.method_identity?.message || ''}`}
                                onChange={(e) => handleChangeDataForm('method_identity', e.target.value)}
                            />
                        </div>
                        
                        <div className={`w-full flex flex-col gap-y-1`}>
                            <span>ช่องทางสำรอง (ถ้ามี)</span>
                            <TextField
                                {...register('reserve_identity')}
                                value={form.reserve_identity}
                                defaultValue={form.reserve_identity}
                                variant="outlined"
                                placeholder={`ธนาคารกรุงเทพ 054-1-45989-2`}
                                className='font_kanit'
                                InputProps={{ className: 'font_kanit' }}
                                fullWidth
                                multiline
                                error={!!errors.reserve_identity}
                                helperText={`${errors.reserve_identity?.message || ''}`}
                                onChange={(e) => handleChangeDataForm('reserve_identity', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <Button
                        type='submit'
                        variant="contained"
                        className={`
                            w-[98%] py-2.5 mt-8 font_kanit bg-[#7800D7]
                            tracking-wider font-light text-orginal
                        `}
                    >
                        สร้างใบเรียกเก็บเงิน
                    </Button>

                    <Button
                        onClick={() => modalState.setOpen(false)}
                        variant="contained" 
                        className={`
                            w-[98%] mt-2.5 font_kanit bg-[#5E5E5E]
                            tracking-wider font-light text-orginal
                        `}
                    >
                        ยกเลิก
                    </Button>

                </form>
            </Modal>
        
        </>
    )
}