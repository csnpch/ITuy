import { useRouter } from "next/router"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
// Services
// Store
import { useSelector } from 'react-redux'
import { 
    getStatusVerifyAuth} from "@/store/slices/authSlice"
// Data
import { cardNavigatorList } from "@/data/cardNavigatorList"
import { RootState } from "@/store"
// Interfaces
import { dataCardNavigator } from "@/interfaces/data"
// Layouts & Components
import { message } from "antd"
import { getDataClient } from "@/store/slices/clientSlice"
import { verifyRouter } from "@/utils/helpers/verifyRouter"
import ModalAskToAuth from "@/components/auth/ModalAskToAuth"
import { openMessageNoti } from "@/utils/helpers/functions"
import LayoutMain from "@/components/layouts/main"
import CardNavigator from "@/components/CardNavigator"
// Others
import useInstallPrompt from "@/utils/hooks/useInstallPrompt"
import { configStepFadeIn } from "@/utils/framerMotion"
import VerifyAuth from "@/components/auth/VerifyAuth"





export default function Home() {
    
    const router = useRouter()
    
    const [messageApi, contextHolder] = message.useMessage() // ant noti

    // Store
    const statusVerifyAuth = useSelector((state: RootState) => getStatusVerifyAuth(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    // Stage
    const [modalAskToAuth, setModalAskToAuth] = useState<boolean>(false)


    useInstallPrompt()


    const handleNavigation = (route: dataCardNavigator) => {
        if (!route.statusActive) {
            openMessageNoti(messageApi, 'warning', ` ฟีเจอร์นี้ยังไม่เปิดให้บริการ`)
            return
        }

        if (
            (route.slug !== 'home' && route.slug !== 'auth') 
            && (!statusVerifyAuth || !verifyRouter(route.routeProtectLevel, dataClient?.role))
        ) {
            openMessageNoti(messageApi, 'error', ` เนื้อหานี้จำเป็นต้องเข้าสู่ระบบก่อน`)
            setModalAskToAuth(true)
            return
        }
        
        router.push(route.pathLink)
    }


    useEffect(() => {
        if (router.query.sendBack) {
            router.push(router.query.sendBack.toString())
        }
    }, [])


    return (
        <>
            { contextHolder }


            <VerifyAuth />


            <ModalAskToAuth
                statusAskToAuth={{
                    isOpen: modalAskToAuth,
                    setOpen: setModalAskToAuth
                }}
            />
            

            <LayoutMain
                navbarFixed
                splashWhiteScreen
            >

                <motion.ul
                    className="container_card_navigator lg:mt-4"
                    variants={configStepFadeIn.container}
                    initial="hidden"
                    animate="visible"
                >
                    {
                        cardNavigatorList.map((item, index) => {
                            return (
                                <motion.li key={index} className="rounded-xl" variants={configStepFadeIn.item}>
                                    <div 
                                        onClick={() => handleNavigation(item)}
                                    >
                                        <CardNavigator
                                            key={index} 
                                            data={item}
                                            classRounded={`rounded-xl`}
                                            classNameHeight={`h-44 md:h-60`}
                                        />
                                    </div>
                                </motion.li>
                            )
                        })
                    }
                </motion.ul>


                {/* GAP */}
                <div className={`my-20`}></div>

            </LayoutMain>

        </>
    )
}
