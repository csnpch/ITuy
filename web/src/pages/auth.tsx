import Image from 'next/image'
import { useRouter } from 'next/router'

import { useState, useMemo, useEffect, useRef, RefObject } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { errMsg } from '@/utils/messages'
import { openMessageNoti } from '@/utils/helpers/functions'
// Services
import { AuthServices } from '@/services/api/auth'
import { AuthLocalStorage } from '@/services/localStorage/auth'
import { ClientLocalStorage } from '@/services/localStorage/client'
// Store
import { useDispatch, useSelector } from 'react-redux'
import { 
    setAccessToken, 
    setStatusVerifyAuth,
    getStatusVerifyAuth
} from '@/store/slices/authSlice'
// For validation
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { formAuthInterface, validationFormAuthSchema } from '@/utils/helpers/yupFormSchema'
// Stores
import { setDataClient } from '@/store/slices/clientSlice'
import { RootState } from '@/store'

// Componenets
import Head from '@/components/Head'
import LoadingScreen from '@/components/loadingScreen'
import DialogRequestAuth from '@/components/auth/dialogRequestAuth'
import { 
    Button as MUI_Button, 
    TextField, IconButton,
    Input, InputLabel,
    InputAdornment, FormControl
} from '@mui/material'
import { message } from 'antd'

// Icons
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// Resource
import BannerAuth1 from '@/assets/imgs/banner_auth_1.svg'
import BannerAuth2 from '@/assets/imgs/banner_auth_2.svg'
import { ClientInterface } from '@/interfaces/client'
import { routes } from '@/data/dict/routes_dict'
import PrepareDataStore from '@/components/store/PrepareDataStore'


export default function Auth() {

    const router = useRouter()
    const dispatch = useDispatch()
    
    const [messageApi, contextHolder] = message.useMessage()    // ant noti
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [openDialogRequestAuth, setOpenDialogRequestAuth] = useState<boolean>(false)
    const [statusSuccess, setStatusSuccess] = useState<boolean>(false)
    const refContainerAuth: RefObject<HTMLDivElement> = useRef(null);

    const statusVerifyAuth = useSelector((state: RootState) => getStatusVerifyAuth(state))

    const [form, setForm] = useState<formAuthInterface>({
        username: '',
        password: ''
    })
    const randomBanner = useMemo(() => {
        return Math.round(Math.random() * 1)
    }, [])

    
    // Form validation setup
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(validationFormAuthSchema),
        reValidateMode: 'onBlur'
    })
    const { errors } = formState
    
    
    const handleToggleShowPassword = () => setShowPassword((prevState) => !prevState)
    

    const handleChangeDataForm = (slugInput: string, value: string): void => {
        if (slugInput === 'username') {
            setForm((prevState: formAuthInterface) => ({
                ...prevState, 
                username: value
            }))
        } else if (slugInput === 'password') {
            setForm((prevState: formAuthInterface) => ({
                ...prevState, 
                password: value
            }))
        }
    }


    const onSingin = async () => {
        if (statusSuccess) return
        await AuthServices.signIn(form.username, form.password)
            .then((res: AxiosResponse | any) => {
                if (res.status === 201) {
                    const dataClient: ClientInterface = res.data.data.client
                    const accessToken: string = res.data.data.accessToken
                    
                    AuthLocalStorage.setAccessToken(accessToken)
                    dispatch(setAccessToken(accessToken))
                    
                    ClientLocalStorage.setDataClient(dataClient)
                    dispatch(setDataClient(dataClient))
                    
                    dispatch(setStatusVerifyAuth(true))
                    setStatusSuccess(true)
                    
                    openMessageNoti(
                        messageApi, 
                        res.data.status_tag, 
                        ` ${res.data.message}`
                    )
                    setTimeout(() => router.push(routes.home.path), 1000)
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

    // for component dialog
    const resetValueDialog = () => { /* trigger useEffect in dialog component */ }


    const scrollToBottom = () => {
        let elAuth = refContainerAuth?.current
        if (!elAuth) return
        if (elAuth.clientWidth < 800) return
        elAuth.scrollTo(0, elAuth.scrollHeight)
    }

    
    const onRequestAuth = async (username: string, section: string): Promise<any> => {
        await AuthServices.requestAccount(username, section)
            .then((res: AxiosResponse | any) => {
                if (res.status === 200 || res.status === 201) {
                    openMessageNoti(messageApi, res.data.status_tag, ` ${res.data.message}`)
                }
                resetValueDialog()
            })
            .catch(err => { 
                openMessageNoti(messageApi, 'error', ` ${err.response?.data?.message}` || errMsg.api.connect)
            })
    }


    useEffect(() => {
        scrollToBottom()
        if (statusVerifyAuth) {
            router.push(routes.home.path)
        }
    }, [])


    return (
        <>
            <PrepareDataStore 
                section
            />


            <div 
                ref={refContainerAuth}
                className='wh-screen fixed overflow-y-auto' 
                style={{background: '#ffffff'}}
            >

                { contextHolder } {/* antd Notification */}
                <LoadingScreen />

                <Head />
                <DialogRequestAuth 
                    statusDialog={{
                        isOpen: openDialogRequestAuth, 
                        setOpen: setOpenDialogRequestAuth
                    }}
                    onRequestAuth={onRequestAuth}
                    onResetValueDialog={resetValueDialog}
                />

                <div className="container-auth relative">
                    {/* float logo-icon */}
                    <span className='absolute top-3 left-4 text-2xl lg:text-xl lg:hidden'>
                        ITuy
                    </span>

                    <div className='wh-full flex items-end'>
                        <div className='mx-auto h-full flex justify-end'>
                            <Image
                                src={randomBanner ? BannerAuth1 : BannerAuth2} alt={''} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom' }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSingin)}>

                        <div className="flex flex-col mt-4 p-10 gap-2 w-full mx-auto pb-40 lg:pb-0">
                            <h2 className='-mb-2 font_kanit select-none'>เข้าสู่ระบบ</h2>
                            <div className='grid grid-rows-2 gap-y-3'>

                                {/* Input-Username */}
                                <div className='flex items-center gap-x-4 mt-4'>
                                    <AccountCircleOutlinedIcon className='mt-4 text-3xl text-gray-600' />
                                    <TextField
                                        {...register('username')}
                                        value={form.username}
                                        error={errors.username && true}
                                        onChange={(e) => handleChangeDataForm('username', e.target.value)}
                                        label={!errors.username ? `Username` : `${errors.username?.message}`} 
                                        variant="standard" 
                                        className={`w-full select-none`}
                                    />
                                </div>

                                {/* Input-Password */}
                                <div className='flex items-center gap-x-4 relative'>
                                    <LockOutlinedIcon className='mt-4 text-3xl text-gray-600' />
                                    <FormControl className='w-full' variant="standard">
                                        <InputLabel htmlFor="input_password" className={`${errors.password && 'text-[#d32f2f]'}`}>
                                            {!errors.password ? `Password` : `${errors.password?.message}` }
                                        </InputLabel>
                                        <Input
                                            {...register('password')}
                                            id="input_password"
                                            value={form.password}
                                            onChange={(e) => handleChangeDataForm('password', e.target.value)}
                                            error={errors.password && true}
                                            type={showPassword ? 'text' : 'password'}
                                            className={`w-full select-none`}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleToggleShowPassword}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </div>

                            </div>

                            <MUI_Button 
                                type="submit"
                                variant="contained" 
                                className={`rounded-lg mt-4 lg:mt-2 h-12 lg:h-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-700`}
                            >
                                Login
                            </MUI_Button>

                            <div className='mt-8 w-full flex items-center justify-center'>
                                <span className='text-center text-sm tracking-wide text-gray-500 select-none'>
                                    ยังไม่มีบัญชีผู้ใช้ ? 
                                </span>
                                <MUI_Button 
                                    onClick={() => setOpenDialogRequestAuth(true)}
                                    className='underline font_kanit font-normal'
                                >
                                    <span className=''>เปิดใช้งานบัญชี</span>
                                </MUI_Button>

                            </div>
                            
                        </div>

                    </form>

                </div>
            </div>
        </>
    )

}