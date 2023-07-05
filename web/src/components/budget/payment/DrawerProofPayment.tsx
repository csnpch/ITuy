import { Drawer } from 'antd'
import { 
    Button as MUI_Button, 
} from '@mui/material'
import { useState } from 'react'

interface propsInterface {
    statusDrawer: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    handleUploadFile?: (file?: any) => void
}


export default function DrawerProofPayment({
    statusDrawer,
    handleUploadFile
}: propsInterface) {

    const [file, setFile] = useState<any>(null)

    const handleSelectedFileUpload = (e: any) => {
        setFile(e.target.files[0])
    }
    const onHandleUploadFile = async () => {
        handleUploadFile && handleUploadFile(file)
    }


    return (
        <>
            <Drawer
                title="อัพโหลดหลักฐานการชำระเงิน ( Slip )"
                className='w-full font_kanit tracking-wide'
                placement={'bottom'}
                closable={false}
                onClose={(() => statusDrawer.setOpen(false))}
                open={statusDrawer.isOpen}
                height={300}
            >
                <div className={`w-full flex flex-col justify-center gap-y-4`}>
                    <input 
                        id="file_input" 
                        type="file"
                        className="
                            block w-full text-sm text-gray-900 border rounded-sm
                            border-gray-300 p-4 cursor-pointer bg-blue-50
                        "
                        onChange={handleSelectedFileUpload}
                    />

                    <MUI_Button
                        variant="contained"
                        color='primary'
                        className={`
                            mb-2 rounded-md py-2.5 w-full font_kanit 
                            font-normal tracking-wider 
                        `}
                        disabled={!file}
                        onClick={onHandleUploadFile}
                    >
                        ยืนยันหลักฐานการชำระเงิน
                    </MUI_Button>
                    {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
                </div>
            </Drawer>
        </>
    )

}