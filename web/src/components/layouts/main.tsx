import Head from 'next/head'
import { useEffect, useState } from 'react'
// Interfaces
import { propsInterface } from '@/interfaces/share/props'
// Data & Services & Utils
import { levels as allRole } from '@/data/dict/role_dict'
import VerifyRouter from './../auth/VerifyRouter'
// Interfaces
import { dataRoutesInterface } from '@/interfaces/routes'
// Components
import { message } from 'antd'
import Navbar from '../navbar'
import SubNavbar from './../SubNavbar'
import LoadingScreen from './../loadingScreen'
import Sidebar from './../Sidebar'
import Backdrop from '@mui/material/Backdrop';
import ModalAuthSignOut from '@/components/auth/ModalAuthSignOut'
import CircularProgress from '@mui/material/CircularProgress';
import PrepareDataStore from './../store/PrepareDataStore'
import VerifyAuth from '../auth/VerifyAuth'


interface propsValue {
    navbarFixed?: boolean,
    navbarDarkTheme?: boolean,
    subNavbar?: boolean,
    splashWhiteScreen?: boolean,
    widthFull?: boolean,
    previousRoute?: dataRoutesInterface,
    currentRoute?: dataRoutesInterface,
    className?: string,
    classNameContent?: string,
    stateLoding?: {
        state: boolean,
        setState: (state: boolean) => void
    }
}


export default function LayoutMain({
    children,
    navbarFixed = false,
    navbarDarkTheme = false,
    subNavbar = false,
    splashWhiteScreen = false,
    widthFull = false,
    previousRoute,
    currentRoute,
    className = '',
    classNameContent = '',
    stateLoding
}: propsInterface & propsValue) {
    
    // or change params to (props: propsInterface) and use this way
    // const { navbarFixed = false } = props
    const [verifyRouter, setVerifyRouter] = useState<boolean>(false)
    
    const [statusShadow, setStatusShadow] = useState<boolean>(false)
    const [openSidebar, setOpenSidebar] = useState(false)
    const [popupAskToSignOut, setPopupAskToSignOut] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();


    // Event for navbar
    useEffect(() => {

        if (navbarFixed) {
            const handleScroll = () => {
                const scrolled = window.scrollY
                setStatusShadow(scrolled > 20)
            }

            window.addEventListener('scroll', handleScroll)
            return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        }

    }, [navbarFixed])


    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
            </Head>


            <PrepareDataStore 
                client
            />


            <VerifyRouter
                routeProtectLevel={currentRoute?.routeProtectLevel || allRole}
                callback={setVerifyRouter}
            />
            

            {/* Loading */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={stateLoding?.state || false}
                onClick={() => {}}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {
                verifyRouter &&
                <>

                    <div className={`
                        container-main relative
                        ${className}
                    `}>

                        { contextHolder } {/* antd message notify */}

                        <ModalAuthSignOut 
                            statusSidebar={{
                                isOpen: openSidebar,
                                setOpen: setOpenSidebar
                            }}
                            statusAskSignOut={{
                                isOpen: popupAskToSignOut,
                                setOpen: setPopupAskToSignOut
                            }}
                            messageApi={messageApi}
                        />
                    

                        <Sidebar 
                            statusSidebar={{
                                isOpen: openSidebar,
                                setOpen: setOpenSidebar
                            }}
                            statusAskSignOut={{
                                isOpen: popupAskToSignOut,
                                setOpen: setPopupAskToSignOut
                            }}
                        />

                        {
                            splashWhiteScreen &&
                            <LoadingScreen />
                        }
                        
                        {
                            !subNavbar ?
                            <div className={`
                                ${navbarFixed && 'fixed z-30'}
                                ${statusShadow && 'shadow-lg'} 
                                w-full
                            `}>
                                <Navbar
                                    darkTheme={navbarDarkTheme}
                                    setOpenSidebar={setOpenSidebar}
                                />
                            </div>
                            :
                            <div className={`
                                w-full
                            `}>
                                <SubNavbar
                                    previousRoute={previousRoute}
                                    currentRoute={currentRoute}
                                    setOpenSidebar={setOpenSidebar}
                                />
                            </div>
                        }

                        <div className={`
                            container-content ${classNameContent}
                            ${!widthFull && 'space-horizontal'}
                            ${navbarFixed && 'pt-20'}
                        `}>
                            { children }
                        </div>
                    </div>

                </>
            }
        </>
    )

}