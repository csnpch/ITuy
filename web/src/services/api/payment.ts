import axios from 'axios';
import config from '@/configs'
import { axiosConfig } from './configs/axiosConfig'
import { formAddPaymentMethodInterface } from '@/utils/helpers/yupFormSchema';

// URL API
const baseURL: string = `${config.ITuy_API}/api/payment`


const acceptPayment = async (
    accessToken: string | null,
    id: string
): Promise<object> => {
    return await axios.post(`${baseURL}/accept/${id}`, {}, await axiosConfig(accessToken))
}


const rejectPayment = async (
    accessToken: string | null,
    id: string
): Promise<object> => {
    return await axios.post(`${baseURL}/reject/${id}`, {}, await axiosConfig(accessToken))
}


const findPaymentByClient = async (
    accessToken: string | null,
    bill_id: string,
    search_word: string = '',
): Promise<object> => {
    return await axios.get(`${baseURL}/findByClient/${bill_id}/${search_word}`, await axiosConfig(accessToken))
}


const findMyPayment = async (
    accessToken: string | null
): Promise<object> => {
    return await axios.get(`${baseURL}/findMyPayment`, await axiosConfig(accessToken))
}


// Method zone
const getPaymentMethod = async (
    accessToken: string | null,
    id?: string
): Promise<object> => {
    return await axios.get(`${baseURL}/methods/${id || ''}`, await axiosConfig(accessToken))
}


const findActivePaymentMethodByTarget = async (
    accessToken: string | null,
    target: string
): Promise<object> => {
    return await axios.get(`${baseURL}/methods/findMethodActiveByTarget/${target}`, await axiosConfig(accessToken))
}


const addPaymentMethod = async (
    accessToken: string | null,
    dataForm: formAddPaymentMethodInterface
): Promise<object> => {
    return await axios.post(`${baseURL}/methods`, {
        ...dataForm
    }, await axiosConfig(accessToken))
}


const disabledMethod = async (accessToken: string | null, id: string) => {
    return await axios.post(
        `${baseURL}/methods/disabled/${id}`, {}, await axiosConfig(accessToken)
    )
}


const setPrimaryMethod = async (accessToken: string | null, id: string) => {
    return await axios.post(
        `${baseURL}/methods/setPrimary/${id}`, {}, await axiosConfig(accessToken)
    )
}


const detectPayment = async (
    accessToken: string | null,
    client_id: string,
): Promise<object> => {
    return await axios.get(`${baseURL}/detectPaymentByClientId/${client_id}`, await axiosConfig(accessToken))
    // return await axios.get(`${baseURL}/detectPaymentByClientId/${client_id}`, await axiosConfig(accessToken))
}


const uploadProofPayment = async (
    accessToken: string | null,
    file: File,
    paymentIDs: string[],
): Promise<object> => {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('paymentIDs', JSON.stringify(paymentIDs))
    return await axios.post(
        `${baseURL}/uploadProofPayment`,
        formData, 
        await axiosConfig(accessToken)
    )
}


const getRealBudget = async (
    accessToken: string | null,
): Promise<object> => {
    const res = await axios.get(`
        ${baseURL}/realBudget`,
        await axiosConfig(accessToken)
    )
    return res.data
}


const getRelationPayment = async (
    accessToken: string | null,
    relation_key: string,
): Promise<object> => {
    const res = await axios.get(`
        ${baseURL}/findByRelationKey/${relation_key}`,
        await axiosConfig(accessToken)
    )
    return res.data
}


export const PaymentServices = {
    acceptPayment,
    rejectPayment,
    findPaymentByClient,
    findMyPayment,
    getRelationPayment,
    getRealBudget,
    detectPayment,
    uploadProofPayment,
    // Method zone
    getPaymentMethod,
    findActivePaymentMethodByTarget,
    addPaymentMethod,
    disabledMethod,
    setPrimaryMethod
}