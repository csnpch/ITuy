import { AuthLocalStorage } from '@/services/localStorage/auth';
import { AuthInterface } from '@/interfaces/auth';

export const axiosConfig = async (accessToken: AuthInterface['accessToken']) => ({
    headers: {
        'Authorization': `Bearer ${
            AuthLocalStorage.getAccessToken() !== 'undefined' ?
            AuthLocalStorage.getAccessToken() : accessToken
      }`,
    }
})