import Link from "next/link"


import { useState } from "react"


// Icons
import { HiOutlineMenuAlt4 } from "react-icons/hi"

import { RiNotification2Line, RiUser6Line, RiUserSmileLine } from "react-icons/ri"

// import { BiUser } from 'react-icons/bi'
// Component
import Badge from "@mui/material/Badge"

import IconButton from '@mui/material/IconButton'
import ModalViewProfile from "./client/ModalViewProfile"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { getDataClient } from "@/store/slices/clientSlice"


interface props {
    darkTheme?: boolean,
    setOpenSidebar?: (value: boolean) => void
}

export default function Navbar({
    darkTheme = false,
    setOpenSidebar = () => {} 
}: props) {


    // stores
    const dataClient = useSelector((state: RootState) => getDataClient(state))
    // states
    // const [unitNotify, setUnitNotify] = useState<number>(0)
    const [modalViewProfile, setModalViewProfile] = useState<boolean>(false)



    return (
        <>

            <ModalViewProfile 
                modalState={{
                    isOpen: modalViewProfile,
                    setOpen: setModalViewProfile
                }}
                client={dataClient}
            />

            <div className={`
                container-nav space-horizontal 
                ${darkTheme && 'bg-[#222222] h-14'}
            `}>
                <div className={`navbar_left`}>
                    <p className={`
                        font_kanit text-2xl tracking-wider
                        ${darkTheme ? 'logo-color-dark' : 'logo-color' }
                    `}>
                        ITuy
                    </p>
                </div>
                <div className={`btn_sidebar flex items-center gap-x-2`}>
                    {/* Ring */}
                    <IconButton
                        size="medium" color='inherit'
                        onClick={() => setModalViewProfile(true)}
                    >
                        {/* <Badge badgeContent={unitNotify ? 12 : 0} color="error"> */}
                        {
                            dataClient !== null && (
                                <RiUserSmileLine 
                                    className={`
                                        text-2xl
                                        ${darkTheme ? 'logo-color-dark' : 'logo-color' }
                                    `}
                                />
                            )
                        }
                        {/* </Badge> */}
                    </IconButton>
                    {/* Hambuger menubar */}
                    <IconButton
                        size="medium" color='inherit'
                        onClick={() => setOpenSidebar(true)}
                    >
                        <HiOutlineMenuAlt4 
                            className={`
                                text-3xl cursor-pointer
                                ${darkTheme ? 'logo-color-dark' : 'logo-color' }
                            `} 
                        />
                    </IconButton>
                </div>
            </div>
        </>
    )
    
}
