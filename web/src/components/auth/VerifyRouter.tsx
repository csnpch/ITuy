import { ignoreProtectRoutes, routes } from "@/data/dict/routes_dict"
import { AuthLocalStorage } from "@/services/localStorage/auth"
import { RootState } from "@/store"
import { getStatusVerifyAuth } from "@/store/slices/authSlice"
import { openMessageNoti } from "@/utils/helpers/functions"
import { verifyRouter } from "@/utils/helpers/verifyRouter"
import { message } from "antd"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSelector } from "react-redux"

interface propsInterface {
    routeProtectLevel: (number | null)[],
    callback: (statusVerify: boolean) => void
}


export default function VerifyRouter({
    routeProtectLevel,
    callback
}: propsInterface) {

    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage()
    const statusVerifyAuth = useSelector((state: RootState) => getStatusVerifyAuth(state))

    
    useEffect(() => {

        if (!verifyRouter(routeProtectLevel)) {
            openMessageNoti(
                messageApi,
                'error',
                'คุณไม่มีสิทธิในการเข้าถึงเนื้อหานี้',
                1.8
            )
            if (router.pathname === routes.home.path) {
                callback(true)
                return
            }
            setTimeout(() => {
                router.push(routes.home.path)
            }, 2000)
            callback(false)
        } else {
            callback(true)
        }
        
    }, [statusVerifyAuth])

    return (
        <>
            { contextHolder }
        </>
    )

}