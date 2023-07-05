// Components
import { Modal, message } from 'antd'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import { DatePicker } from 'antd'
import type { DatePickerProps } from 'antd'
import MultipleSelectChip from '@/components/MultipleSelectChip'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getDataCollegian } from '@/store/slices/collegianReducer'
import { getDataPayment } from '@/store/slices/paymentSlice'
import { useEffect, useState } from 'react'
import { PaymentMethodInterface } from '@/interfaces/payment'
// Other
import { formAddBillInterface, validationFormAddBillSchema } from '@/utils/helpers/yupFormSchema'
// Yup validate
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { openMessageNoti } from '@/utils/helpers/functions'


interface propsModalVerifyPayment {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    onSubmitForm?: (actionType: string, {}: formAddBillInterface) => void,
    resetForm?: () => void,
}


export default function ModalAddBill({ 
    modalState,
    onSubmitForm = () => {},
    resetForm = () => {},
}: propsModalVerifyPayment) {

    const [messageApi, contextHolder] = message.useMessage()
    // stores
    const dataCollegian = useSelector((state: RootState) => getDataCollegian(state))
    const dataPayment = useSelector((state: RootState) => getDataPayment(state))
    // states
    const [form, setForm] = useState<formAddBillInterface>({
        target: [],
        title: '',
        description: '',
        amount: '',
        deadline: '',
    })

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationFormAddBillSchema),
        reValidateMode: 'onBlur'
    })
    const { errors } = formState


    // trigger reset form
    useEffect(() => {
        setForm({
            target: [],
            title: '',
            description: '',
            amount: '',
            deadline: ''
        })
    }, [resetForm])


    
    const handleChangeTarget = (value: number[]): void => {
        setForm((prevState: formAddBillInterface) => ({
            ...prevState,
            target: value
        }))
    }


    const handleChangeDataForm = (key: string, value: string): void => {
        setForm((prevState: formAddBillInterface) => ({
            ...prevState,
            [key]: value
        }))
    }

    
    const onChangeDeadline: DatePickerProps['onChange'] = (_, dateString) => {
        handleChangeDataForm('deadline', dateString)
    }

    
    const handleSubmitForm = () => {
        if (form.target.length === 0) {
            openMessageNoti(
                messageApi,
                'error', `โปรดเลือกแจ้งบิลให้กับชั้นปี`
            )
            return
        } else if (form.deadline === '') {
            openMessageNoti(
                messageApi,
                'error', `โปรดระบุชำระภายในวันที่`
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

                    <p className={`text-lg tracking-wide text-[#0014C7]`}>
                        สร้างใบเรียกเก็บเงินใหม่
                    </p>

                    <div className={`w-[98%] mt-6 flex-center flex-col gap-y-5`}>
                        <TextField
                            {...register('title')}
                            value={form.title}
                            error={!!errors.title}
                            helperText={`${errors.title?.message || ''}`}
                            variant="outlined"
                            label="ชื่อบิลเรียกเก็บเงิน *"
                            InputLabelProps={{ className: 'font_kanit' }}
                            InputProps={{ className: 'font_kanit' }}
                            fullWidth
                            onChange={(e) => handleChangeDataForm('title', e.target.value)}
                        />
                        <TextField
                            value={form.description}
                            variant="outlined"
                            label="รายละเอียด"
                            InputLabelProps={{ className: 'font_kanit' }}
                            InputProps={{ className: 'font_kanit' }}
                            fullWidth
                            multiline
                            onChange={(e) => handleChangeDataForm('description', e.target.value)}
                        />
                        <TextField
                            {...register('amount')}
                            value={form.amount}
                            error={!!errors.amount}
                            helperText={`${errors.amount?.message || ''}`}
                            variant="outlined"
                            label="จำนวนเงิน *"
                            InputLabelProps={{ className: 'font_kanit' }}
                            InputProps={{ className: 'font_kanit' }}
                            type='number'
                            fullWidth
                            onChange={(e) => handleChangeDataForm('amount', e.target.value)}
                        />

                        {/* Target Year Bill */}
                        <MultipleSelectChip
                            label={`แจ้งบิลชำระให้กับชั้นปี *`}
                            dataSelect={
                                (dataCollegian?.yearStd?.map(item => 
                                    ({label: item.toString(), value: item})
                                ).reverse()) || []
                            }
                            className='w-full'
                            onSelected={handleChangeTarget}
                        />


                        <div className={`grid grid-cols-[6.8rem_2fr] items-center gap-x-2`}>
                            <span className={`
                                text-orginal text-left
                            `}>
                                ชำระภายในวันที่
                            </span>
                            <DatePicker 
                                className={`w-full py-3 px-4 text-lg`}
                                format="DD-MM-YYYY"
                                onChange={onChangeDeadline}
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