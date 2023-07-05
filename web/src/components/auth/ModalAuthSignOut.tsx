import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
// Stores
import { setAccessToken, setStatusVerifyAuth } from "@/store/slices/authSlice"
import { setDataClient } from "@/store/slices/clientSlice"
// Datas
import { routes } from "@/data/dict/routes_dict"
// Services
import { AuthLocalStorage } from '@/services/localStorage/auth'
import { ClientLocalStorage } from '@/services/localStorage/client'
// Components
import { Button } from '@mui/material'
import { Modal } from "antd"
import { openMessageNoti } from "@/utils/helpers/functions"
import { MessageInstance } from "antd/es/message/interface"


interface propsModalAskToSignout {
    statusSidebar: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    statusAskSignOut: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    messageApi: MessageInstance
}

export default function ModalAuthSignOut({ 
    statusSidebar, 
    statusAskSignOut,
    messageApi
}: propsModalAskToSignout) {

    const router = useRouter()
    const dispatch = useDispatch()

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

    const handleCancel = () => {
        statusAskSignOut.setOpen(false)
        statusSidebar.setOpen(true)
    }


    return (
        <>
            {/* Modal */}
            <Modal
                title='' 
                open={statusAskSignOut.isOpen} 
                onCancel={handleCancel}
                centered
                closable={false}
                footer={null}
            >
                <Button
                    onClick={onSignOut}
                    variant="contained"
                    color="error" 
                    className={`w-full py-6 font_kanit tracking-wider text-orginal`}
                >
                    ออกจากระบบเดี๋ยวนี้
                </Button>
                <Button 
                    onClick={handleCancel}
                    variant="outlined" 
                    color="inherit"
                    className={`mt-2 py-4 w-full font_kanit tracking-wider text-orginal`}
                >
                    ยังก่อน
                </Button>
            </Modal>
        </>
    )
}