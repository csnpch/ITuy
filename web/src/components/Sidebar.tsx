import { useRouter } from 'next/router'

import React, { useState } from 'react'
import { routes } from '@/data/dict/routes_dict'
// Store
import { useSelector } from 'react-redux'
import { getStatusVerifyAuth } from "@/store/slices/authSlice"
import { getDataClient } from '@/store/slices/clientSlice'
// Services
import { openMessageNoti } from '@/utils/helpers/functions'
import { verifyRouter } from '@/utils/helpers/verifyRouter'
// Data
import { dataRoutesInterface } from '@/interfaces/routes'
import { RootState } from "@/store"
// Components
import { message } from 'antd'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton';
import ModalAskToAuth from './auth/ModalAskToAuth'

// Icons
import { CgClose } from 'react-icons/cg'
import { HiOutlineMail } from 'react-icons/hi'
// Icons - fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { getRoleNameByStatus, roles } from '@/data/dict/role_dict'
// import { BsGenderFemale } from 'react-icons/bs'


interface props {
    statusSidebar: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    },
    statusAskSignOut: {
        isOpen: boolean,
        setOpen: (value: boolean) => void
    }
}


export default function Sidebar({ statusSidebar, statusAskSignOut }: props) {

    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage() // ant noti

    const statusVerifyAuth = useSelector((state: RootState) => getStatusVerifyAuth(state))
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    const [modalAskToAuth, setModalAskToAuth] = useState<boolean>(false)

    const handleNavigation = (route: dataRoutesInterface) => {
        if (!route.statusActive) {
            openMessageNoti(messageApi, 'warning', ` ฟีเจอร์นี้ยังไม่เปิดให้บริการ`)
            return
        }

        if (route.path === router.pathname) {
            statusSidebar.setOpen(false)
            return
        }

        if (
            route.slug !== 'auth' 
            && (!statusVerifyAuth || !verifyRouter(route.routeProtectLevel, dataClient?.role))
        ) {
            openMessageNoti(messageApi, 'error', ` เนื้อหานี้จำเป็นต้องเข้าสู่ระบบก่อน`)
            statusSidebar.setOpen(false)
            setModalAskToAuth(true)
            return
        }
        
        router.push(route.path)
    }



    return (
        <>
            { contextHolder }

            <ModalAskToAuth
                statusAskToAuth={{
                    isOpen: modalAskToAuth,
                    setOpen: setModalAskToAuth
                }}
            />

            <React.Fragment key={'right'}>
                <Drawer
                    anchor={'right'}
                    open={statusSidebar.isOpen}
                    onClose={() => statusSidebar.setOpen(false)}
                >

                    {/* Sidebar container */}
                    <div
                        className={`
                            relative w-[16rem] md:w-[24rem] xl:max-w-[20rem] 
                            flex flex-col h-full overflow-x-hidden
                        `}
                    >
                        
                        {/* Button close container */}
                        <IconButton
                            size="medium" color='inherit'
                            onClick={() => statusSidebar.setOpen(false)}
                            className={`
                                mt-2 ml-2 p-2 cursor-pointer w-min group
                            `}
                        >
                        
                            <CgClose 
                                className={`
                                    text-2xl transform
                                    active:text-indigo-800 active:scale-125
                                `}
                            />
                            
                        </IconButton>


                        {/* Welcome message & user preview */}
                        <div className='ml-6 mr-4 mt-6 flex flex-col gap-y-1'>
                            
                            <p className={`
                                tracking-wide select-none
                            `}>
                                {
                                    !statusVerifyAuth 
                                    ? 'ยินดีต้อนรับ'
                                    : `สวัสดี${
                                        dataClient?.nickname 
                                        ? `\`${dataClient?.nickname}\``
                                        : '' 
                                    }` 
                                }
                                , <span className='text-sm'>ขอให้เป็นวันที่ดี :)</span>
                            </p>

                            {
                                
                                (
                                    statusVerifyAuth && dataClient?.role
                                    && dataClient?.role !== roles.guest.level
                                    && dataClient?.role !== roles.member.level
                                ) ?
                                <p className={`
                                    tracking-wide select-none mt-1 mb-2 text-sm
                                `}>
                                    { `ตำแหน่ง: ${getRoleNameByStatus(dataClient?.role)}` }
                                </p>
                                : <></>
                            }

                            <p className={`
                                text-black/60 text-xs flex items-center
                                ${statusVerifyAuth && 'grid'}  
                                grid-cols-[0.8rem_1fr] xl:grid-cols-[1.2rem_1fr]
                                items-center gap-x-1
                                ${!statusVerifyAuth && 'select-none'}
                            `}>
                                {
                                    !statusVerifyAuth 
                                    ? `โปรดเข้าสู่ระบบเพื่อเริ่มใช้งานฟีเจอร์ต่าง ๆ`
                                    : <>
                                        <HiOutlineMail className='text-[0.8rem] lg:text-lg' />
                                        {
                                            dataClient?.email || `Email not found`
                                        }
                                    </>
                                }
                            </p>
                        </div>


                        {/* Menus containers */}
                        <div className={`ml-8 mr-4 mt-12 flex flex-col gap-y-8 select-none`}>
                            {
                                Object.values(routes).sort(
                                    (a, b) => Number(b.statusActive) - Number(a.statusActive)
                                ).map((route: dataRoutesInterface, index) => (
                                    <div
                                        onClick={() => handleNavigation(route)} 
                                        key={index} 
                                        className={`
                                            relative z-10
                                            flex items-center gap-4 cursor-pointer 
                                            duration-200 active:ml-1
                                            ${ statusVerifyAuth && route.slug === 'auth' && 'hidden' }
                                            ${ 
                                                (route.staffOnly && (
                                                    dataClient?.role !== roles.chairman.level
                                                    && dataClient?.role !== roles.admin.level
                                                    && dataClient?.role !== roles.secretary.level
                                                ))                                                
                                                && 'hidden' 
                                            }
                                            ${ 
                                                (
                                                    !route.statusShowOnSidebar
                                                ) && 'hidden'
                                            }
                                            ${ !route.statusActive && 'text-black/40' }
                                        `}
                                    >
                                        {/* Icon */}
                                        {
                                            route.slug === 'home'
                                            ? route.icon()
                                            : route.icon('text-lg')
                                        }
                                        {/* Name menu */}
                                        <span className={`
                                            text-sm
                                            ${!route.statusActive && 'line-through'}
                                            ${route.slug === 'home' && 'ml-[0.056rem]'}
                                        `}>
                                            {route.title.th}
                                        </span>
                                        {/* On menu is selected & active */}
                                        <div 
                                            className={`
                                                ${
                                                    router.pathname === route.path 
                                                    ? 'block' : 'hidden'
                                                }
                                                absolute z-0 bg-black/5 w-11/12 py-4 h-full left-2 rounded-lg 
                                            `} 
                                        />
                                    </div>

                                ))   
                            }
                        </div>

                        {/* Signout container */}
                        {
                            statusVerifyAuth &&
                            <div
                                className={`
                                    absolute bottom-0 left-0 w-full h-20 pt-4 select-none    
                                `}
                            >

                                {/* Button sign out */}
                                <div 
                                    onClick={() => {
                                        statusSidebar.setOpen(false);
                                        statusAskSignOut.setOpen(true);
                                    }} 
                                    className={`
                                        ml-10 mr-4 flex items-center gap-4 cursor-pointer 
                                        duration-200 active:ml-12 text-sm
                                    `}
                                >
                                    {/* Icon */}
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    {/* Name menu */}
                                    <span className={``}>
                                        Sign Out
                                    </span>
                                </div>

                            </div>
                        }
                        
                    </div>

                    
                </Drawer>
            </React.Fragment>
        </>
    )

}