import axios from 'axios';
import config from '@/configs'
import { axiosConfig } from './configs/axiosConfig'

// URL API
const baseURL: string = `${config.ITuy_API}/api/client`


const addStartedInfo = async (
    accessToken: string | null,
    nickname: string, 
    fullname: string
): Promise<object> => {
    return await axios.post(`${baseURL}/addStartedInfo`, {
        nickname: nickname,
        fullname: fullname
    }, await axiosConfig(accessToken))
}


const getListDataClient = async (
    accessToken: string | null,
    yearStd: string = 'all',
    sectionStd: string = 'all',
    page: number = 1,
    limit: number = 10
): Promise<any> => {
    const res = await axios.get(
        `${baseURL}?page=${page}&limit=${limit}&yearStd=${yearStd}&sectionStd=${sectionStd}`,
        await axiosConfig(accessToken)
    )
    return res.data
}


const getDataClient = async (
    accessToken: string | null,
    yearStd: string = 'all',
    sectionStd: string = 'all',
): Promise<object> => {
    return await axios.get(`${baseURL}/getDataClient/${yearStd}/${sectionStd}`, await axiosConfig(accessToken))
}


export const ClientServices = {
    getDataClient,
    getListDataClient,
    addStartedInfo
}