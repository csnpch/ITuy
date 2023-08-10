import axios from 'axios';
import config from '@/configs'
import { axiosConfig } from './configs/axiosConfig'
import { billDict } from '@/data/dict/bill_dict';
import { formAddBillInterface } from '@/utils/helpers/yupFormSchema';

// URL API
const baseURL: string = `${config.ITuy_API}/api/bill`


const getBill = async (
    accessToken: string | null,
    page = 1,
    pageSize = 5,
    yearStd = 'all',
    sectionStd = 'all',
): Promise<any> => {
    return await axios.get(
        `${baseURL}?page=${page}&limit=${pageSize}&yearStd=${yearStd}&sectionStd=${sectionStd}`, 
        await axiosConfig(accessToken)
    )
}


const getBllById = async (
    accessToken: string | null,
    id: string,
    yearStd = 'all',
    sectionStd = 'all',
): Promise<any> => {
    return await axios.get(`${baseURL}/${id}?yearStd=${yearStd}&sectionStd=${sectionStd}`, await axiosConfig(accessToken))
}


const changeStatusBill = async (
    accessToken: string | null,
    status: number | null,
    id: string,
): Promise<any> => {
    if (status === billDict.appove.status) {
        return await axios.get(`${baseURL}/approveBill/${id}`, await axiosConfig(accessToken))
    } else if (status === billDict.cancel.status) {
        return await axios.get(`${baseURL}/cancelBill/${id}`, await axiosConfig(accessToken))
    } else if (status === billDict.close.status) {
        return await axios.get(`${baseURL}/closeBill/${id}`, await axiosConfig(accessToken))
    }
}


const addBill = async (
    accessToken: string|null, 
    dataForm: formAddBillInterface
) => {
    return await axios.post(
        `${baseURL}/`, { ...dataForm },
        await axiosConfig(accessToken)
    )

}


export const BillServices = {
    getBill,
    getBllById,
    addBill,
    changeStatusBill
}