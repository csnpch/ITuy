import axios from 'axios';
import config from '@/configs'
import { axiosConfig } from './configs/axiosConfig'

// URL API
const baseURL: string = `${config.ITuy_API}/api/auth`


const requestAccount = async (username: string, section: string): Promise<object> => {
    return await axios.post(`${baseURL}/requestAccount`, {
        username: username,
        section: section
    })
}


const acceptAccount = async (
    accessToken: string | null,
    id: string,
    branch: string,
): Promise<object> => {
    return await axios.post(`${baseURL}/acceptAccount`, {
        id: id,
        branch: branch
    }, await axiosConfig(accessToken))
}



const verifyAccessToken = async (accessToken: string | null): Promise<object> => {
    return await axios.post(`${baseURL}/`, {}, await axiosConfig(accessToken))
}


const signIn = async (username: string, password: string): Promise<object> => {
    return await axios.post(`${baseURL}/signIn`, {
        username: username,
        password: password
    })
}


export const AuthServices = {
    requestAccount,
    acceptAccount,
    verifyAccessToken,
    signIn,
}

