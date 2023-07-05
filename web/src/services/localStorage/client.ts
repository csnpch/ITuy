import { ClientInterface } from '../../interfaces/client';
const keyDataClient = 'dataClient' 

const setDataClient = (value: ClientInterface) => {
    localStorage.setItem(keyDataClient, JSON.stringify(value))
}

const getDataClient = (): ClientInterface | null => {
    const data = localStorage.getItem(keyDataClient)
    if (data === 'undefined') {
        removeDataClient()
        return null
    }
    return data ? JSON.parse(data) : null
}

const removeDataClient = (): void => {
    localStorage.removeItem(keyDataClient)
}


export const ClientLocalStorage = {
    setDataClient,
    getDataClient,
    removeDataClient
}