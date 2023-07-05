import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AxiosError, AxiosResponse } from "axios"

// Store
import { RootState } from "@/store"
import { 
    fetchAccessTokenFromStorage, 
    getAccessToken, 
    setStatusVerifyAuth 
} from "@/store/slices/authSlice"
import { 
    fetchDataClientFromStorage, 
    getDataClient, 
    setDataClient 
} from "@/store/slices/clientSlice"
// Services
import { ClientServices } from '@/services/api/client'
import { AuthServices } from "@/services/api/auth"
import { openMessageNoti } from "@/utils/helpers/functions"
import { ClientLocalStorage } from '@/services/localStorage/client'
import { formReceiveInfoInterface } from "@/utils/helpers/yupFormSchema"
import { AuthLocalStorage } from '@/services/localStorage/auth'
// Interfaces
import { ClientInterface } from "@/interfaces/client"
// Components
import { message } from "antd"
import { errMsg } from "@/utils/messages"
import ModalReceiveInfo from "@/components/client/ModalReceiveInfo"
import { ignoreProtectRoutes, routes } from "@/data/dict/routes_dict"
import { useRouter } from "next/router"
import { swal } from "@/utils/sweetAlert"


export default function VerifyAuth() {

    const [messageApi, contextHolder] = message.useMessage() // ant noti
    const router = useRouter()
    
    const dispatch = useDispatch()
    const accessToken = useSelector((state: RootState) => getAccessToken(state))

    const [modalReceiveInfo, setModalReceiveInfo] = useState<boolean>(false)


    useEffect(() => {
        verifyAuth()
    }, [])


    const verifyAuth = async () => {

        dispatch(fetchAccessTokenFromStorage())
        dispatch(fetchDataClientFromStorage())

        await AuthServices.verifyAccessToken(accessToken)
            .then((res: AxiosResponse | any) => {
                if (res.status === 200) {
                    // Update dataClient
                    const callbackdataClient = res.data.data
                    dispatch(setDataClient(callbackdataClient))
                    ClientLocalStorage.setDataClient(callbackdataClient)

                    const dispatchStatusVerifyAuth = dispatch(setStatusVerifyAuth(true));
                    checkClientInfo({ statusOpenModal: dispatchStatusVerifyAuth.payload })
                }
            })
            .catch((err: AxiosError | any) => {
                if (!AuthLocalStorage.getAccessToken()) return
                dispatch(setStatusVerifyAuth(false))
                if (err.response?.data?.statusState === 'token_expired') {
                    AuthLocalStorage.removeAccessToken()
                    swal.fire({
                        title: 'โทเคนยืนยันตัวตนหมดอายุ?',
                        text: "โปรดเข้าสู่ระบบใหม่อีกครั้ง เพื่อรับโทเคนใหม่สำหรับยืนยันตัวตน",
                        icon: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'เข้าสู่ระบบเดี๋ยวนี้',
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.push(routes.auth.path)
                        }
                    })
                } else {
                    openMessageNoti(
                        messageApi, 
                        'error', 
                        ` เกิดข้อผิดพลาด, โปรดเข้าสู่ระบบใหม่`
                    )
                    router.push(routes.auth.path)
                }
            })
    }

    
    const checkClientInfo = ({ statusOpenModal }: {statusOpenModal: boolean}) => {
        let dataClient = ClientLocalStorage.getDataClient()
        if (dataClient?.nickname !== null && dataClient?.fullname !== null) return;
        statusOpenModal && setModalReceiveInfo(true)
    }

    
    const onSubmitModalReceiveInfo = async (form: formReceiveInfoInterface) => {
        await ClientServices.addStartedInfo(accessToken, form.nickname, form.fullname)
            .then((res: AxiosResponse | any) => {
                if (res.status === 200) {
                    const dataClient: ClientInterface = res.data.data.client
                    
                    ClientLocalStorage.setDataClient(dataClient)
                    dispatch(setDataClient(dataClient))
                    
                    dispatch(setStatusVerifyAuth(true))
                    
                    openMessageNoti(messageApi, res.data.status_tag,  ` ${res.data.message}`)
                    setModalReceiveInfo(false)
                }
            })
            .catch((err: AxiosError | any) => {
                openMessageNoti(
                    messageApi, 
                    err.response?.data?.status_tag, 
                    ` ${err.response?.data?.message}` || errMsg.api.connect
                )
            })
    }



    return (
        <>
            { contextHolder }

            <ModalReceiveInfo
                statusReceiveInfo={{
                    isOpen: modalReceiveInfo,
                    setOpen: setModalReceiveInfo
                }}
                onSubmitForm={onSubmitModalReceiveInfo}
            />
        
        </>
    )

}
