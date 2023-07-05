import { ClientLocalStorage } from '@/services/localStorage/client';


export const verifyRouter = (
    routeProtectLevel: (number|null)[], 
    role: (number|null|undefined) = undefined
): boolean => 
{
    if (role === undefined) {
        const dataClient = ClientLocalStorage.getDataClient()
        role = dataClient ? dataClient.role : null
    }
    // return true if equal some elemet 
    // eg: role:1 in routeProtectLevel:[1, 2, 4, 5] 
    // result is pass, 1 equal routeProtectLevel[0]
    return routeProtectLevel.includes(role)
}
