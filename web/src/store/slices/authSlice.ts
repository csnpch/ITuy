import { AuthLocalStorage } from '@/services/localStorage/auth';
import { AuthInterface } from '@/interfaces/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './../'


const initialState: AuthInterface = {
    accessToken: null,
    statusVerifyAuth: false,
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<AuthInterface['accessToken']>) => {
            state.accessToken = action.payload
        },
        fetchAccessTokenFromStorage: (state) => {
            state.accessToken = AuthLocalStorage.getAccessToken()
        },
        setStatusVerifyAuth: (state, action: PayloadAction<AuthInterface['statusVerifyAuth']>) => {
            state.statusVerifyAuth = action.payload
        },
    },
})


export const getAccessToken = (state: RootState): string | null => state.auth.accessToken
export const getStatusVerifyAuth = (state: RootState): boolean => state.auth.statusVerifyAuth


export const {
    setAccessToken,
    fetchAccessTokenFromStorage,
    setStatusVerifyAuth
} = authSlice.actions

export default authSlice.reducer