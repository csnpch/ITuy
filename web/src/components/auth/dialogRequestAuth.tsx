import { useState, useEffect } from 'react'
import { isDesktop } from 'react-device-detect'
import { AxiosError, AxiosResponse } from 'axios'
// Interfaces
import { SectionInterface } from '@/interfaces/collegian'
// Services
import { CollegianServices } from '@/services/api/collegian'
// Components
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
// Components - MUI Form
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'


interface DialogRequestAuthProps {
    statusDialog: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    onRequestAuth: (username: string, section: string) => void,
    onResetValueDialog: (value: boolean) => void,
}


export default function DialogRequestAuth({
    statusDialog,
    onRequestAuth,
    onResetValueDialog
}: DialogRequestAuthProps) {
    
    const [dataSections, setDataSections] = useState<SectionInterface[] | null>(null)
    
    const [valueStdNo, setValueStdNo] = useState<string>('')
    const [statusValidateStdNo, setStatusValidateStdNo] = useState<boolean>(true)
    
    const [valueSection, setValueSection] = useState<string>('')
    const [statusValidateSection, setStatusValidateSection] = useState<boolean>(true)


    const handdleChangeValueStdNo = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.value.length > 13) return
        if (event.target.value.length === 13) setStatusValidateStdNo(true)
        setValueStdNo(_ => event.target.value)
    }


    const handleChangeValueSection = (event: SelectChangeEvent) => {
        setValueSection(event.target.value)
    }


    const handdleSummitValue = (): void => {
        // Valdate std no
        if (valueStdNo.length < 13) {
            setStatusValidateStdNo(false)
            return
        }
        // Validate Section
        if (valueSection === '') {
            setStatusValidateSection(false)
            return
        }

        setStatusValidateStdNo(true)
        setStatusValidateSection(true)
        statusDialog.setOpen(false)
        onRequestAuth(valueStdNo, valueSection)
    }


    const getDataSections = async () => {
        await CollegianServices.getSection()
            .then((res: AxiosResponse | any) => {
                if (res.status === 200) {
                    setDataSections(res.data.data)
                }
            })
            .catch((err: AxiosError | any) => {
                console.log('err', err)
            })
    }
    
    
    useEffect(() => {
        return () => {
          setValueStdNo('')     
          setValueSection('')
        }
    }, [onResetValueDialog])


    useEffect(() => {
        if (statusDialog.isOpen && !dataSections) 
            getDataSections()
    }, [statusDialog.isOpen])


    return (
        <>
            <Dialog open={statusDialog.isOpen} onClose={() => statusDialog.setOpen(false)}>
                <DialogTitle>
                    <p className='font_kanit'>
                        ขอเปิดใช้งานบัญชี
                        {/* <span className='text-sm pl-4 text-red-600 font-normal tracking-wide'>
                            ( เฉพาะสาขา IT )
                        </span> */}
                    </p>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span className='font_kanit'>
                            ดำเนินการขอเปิดบัญชีผู้ใช้งานก่อนเข้าใช้งานระบบ 
                            และรอผลการอนุมัติบัญชีผ่านทาง{isDesktop && ' '}อีเมลล์ประมาณ 1-3 วัน 
                            หลังจากนั้นคุณจะสามารถเข้าใช้งานระบบได้
                        </span>
                    </DialogContentText>
                    <TextField
                        error={!statusValidateStdNo}
                        helperText={`${!statusValidateStdNo ? 'รหัสนักศึกษาควรมี 13 หลัก' : ''}`}
                        value={valueStdNo}
                        autoFocus
                        margin="dense"
                        label="รหัสนักศึกษา"
                        type="number"
                        fullWidth
                        variant="standard"
                        className='mt-4 font_kanit'
                        onChange={handdleChangeValueStdNo}
                    />
                    <FormControl 
                        variant="standard"
                        className={`w-full mt-2`}
                        error={!statusValidateStdNo}
                    >
                        <InputLabel>Section</InputLabel>
                        <Select
                            value={valueSection}
                            onChange={handleChangeValueSection}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                dataSections &&
                                dataSections.map((item, index) => {
                                    return (
                                        <MenuItem 
                                            key={index} 
                                            value={item.sec}
                                            className={`font_kanit`}
                                        >
                                            {item.sec_name}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                        <FormHelperText>{!statusValidateSection && 'โปรดเลือกตอนเรียน'}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => statusDialog.setOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handdleSummitValue}>ส่งคำขอ</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}