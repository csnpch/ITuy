import axios from 'axios';
import config from '@/configs'
import { axiosConfig } from './configs/axiosConfig'
import { formAddPaymentMethodInterface } from '@/utils/helpers/yupFormSchema';

// URL API
const baseURL: string = `${config.ITuy_API}/api/transaction`


const getTnxAll = async (
    accessToken: string | null,
    page: number = 1,
): Promise<object> => {
    const res = await axios.get(`
        ${baseURL}?page=${page}`, 
        await axiosConfig(accessToken)
    )
    return res.data
}


const getTnxApprove = async (
    accessToken: string | null,
    page: number = 1,
): Promise<object> => {
    const res = await axios.get(`
        ${baseURL}/approve?page=${page}`,
        await axiosConfig(accessToken)
    )
    return res.data
}


const addTnx = async (
    accessToken: string | null,
    data: formAddPaymentMethodInterface,
): Promise<object> => {
    const res = await axios.post(`
        ${baseURL}/`,
        data,
        await axiosConfig(accessToken)
    )
    return res.data
}


const approveTnx = async (
    accessToken: string | null,
    id: string,
): Promise<object> => {
    const res = await axios.get(`
        ${baseURL}/approve/${id}`,
        await axiosConfig(accessToken)
    )
    return res.data
}


const rejectTnx = async (
    accessToken: string | null,
    id: string,
): Promise<object> => {
    const res = await axios.get(`
        ${baseURL}/reject/${id}`,
        await axiosConfig(accessToken)
    )
    return res.data
}


export const TnxServices = {
    getTnxAll,
    getTnxApprove,
    addTnx,
    approveTnx,
    rejectTnx,
}