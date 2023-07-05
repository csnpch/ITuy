// Components
import { Modal } from 'antd'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
// Other
import { formAddTnxInterface, validationFormAddTnxSchema } from '@/utils/helpers/yupFormSchema'
// Yup validate
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'


interface propsModalVerifyPayment {
    modalState: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    onSubmitForm?: (actionType: string, {}: formAddTnxInterface) => void,
    resetForm?: () => void,
}


export default function ModalAddTnx({ 
    modalState,
    onSubmitForm = () => {},
    resetForm = () => {},
}: propsModalVerifyPayment) {

    // states
    const [form, setForm] = useState<formAddTnxInterface>({
        title: '',
        description: '',
        amount: '',
        link_evidence: '',
    })

    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationFormAddTnxSchema),
        reValidateMode: 'onBlur'
    })
    const { errors } = formState


    // trigger reset form
    useEffect(() => {
        setForm({
            title: '',
            description: '',
            amount: '',
            link_evidence: ''
        })
    }, [resetForm])


    const handleChangeDataForm = (key: string, value: string): void => {
        setForm((prevState: formAddTnxInterface) => ({
            ...prevState,
            [key]: value
        }))
    }

    
    const handleSubmitForm = () => {
        onSubmitForm('insert', form)
    }
    

    return (
        <>

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
                        ขอเบิกงบประมาณ
                    </p>

                    <div className={`w-[98%] mt-6 flex-center flex-col gap-y-5`}>
                        <TextField
                            {...register('title')}
                            value={form.title}
                            error={!!errors.title}
                            helperText={`${errors.title?.message || ''}`}
                            variant="outlined"
                            label="ชื่องบประมาณ *"
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
                            {...register('link_evidence')}
                            value={form.link_evidence}
                            error={!!errors.link_evidence}
                            helperText={`${errors.link_evidence?.message || ''}`}
                            variant="outlined"
                            label="ลิ้งค์หลักฐานประกอบการเบิก *"
                            InputLabelProps={{ className: 'font_kanit' }}
                            InputProps={{ className: 'font_kanit' }}
                            fullWidth
                            multiline
                            onChange={(e) => handleChangeDataForm('link_evidence', e.target.value)}
                        />
                        <TextField
                            {...register('amount')}
                            value={form.amount}
                            error={!!errors.amount}
                            helperText={`${errors.amount?.message || ''}`}
                            variant="outlined"
                            label="จำนวนเงินที่ขอเบิก *"
                            InputLabelProps={{ className: 'font_kanit' }}
                            InputProps={{ className: 'font_kanit' }}
                            type='number'
                            fullWidth
                            onChange={(e) => handleChangeDataForm('amount', e.target.value)}
                        />

                    </div>
                    
                    <Button
                        type='submit'
                        variant="contained"
                        className={`
                            w-[98%] py-2.5 mt-8 font_kanit bg-[#7800D7]
                            tracking-wider font-light text-orginal   
                        `}
                    >
                        สร้างคำขอเบิกงบประมาณ
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