import axios from 'axios';
import config from '@/configs'
import { axiosConfig } from './configs/axiosConfig'

// URL API
const baseURL: string = `${config.ITuy_API}/api/collegian`


const getYearStd = async (): Promise<object> => {
    return await axios.get(`${baseURL}/yearStd`)
}

const getSection = async (): Promise<object> => {
    return await axios.get(`${baseURL}/section`)
}


export const CollegianServices = {
    getYearStd,
    getSection
}