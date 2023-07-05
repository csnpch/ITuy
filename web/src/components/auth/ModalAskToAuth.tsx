import Link from "next/link"
import { Button } from "@mui/material"
import { Modal } from "antd"
import { MessageInstance } from "antd/es/message/interface"


interface propsModalAskToAuth {
    statusAskToAuth: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
}
export default function ModalAskToAuth({ 
    statusAskToAuth,
}: propsModalAskToAuth) {
    return (
        <>
            {/* Modal */}
            <Modal 
                title='' 
                open={statusAskToAuth.isOpen} 
                onCancel={() => statusAskToAuth.setOpen(false)}
                centered
                closable={false}
                footer={null}
            >
                <Link href="/auth">
                    <Button
                        variant="contained" 
                        className={`w-full py-6 font_kanit tracking-wider text-orginal`}
                    >
                        เข้าสู่ระบบตอนนี้
                    </Button>
                </Link>
                <Button 
                    onClick={() => statusAskToAuth.setOpen(false)}
                    variant="outlined" 
                    className={`mt-2 py-4 w-full font_kanit tracking-wider text-orginal`}
                >
                    ยังก่อน
                </Button>
            </Modal>
        
        </>
    )
}