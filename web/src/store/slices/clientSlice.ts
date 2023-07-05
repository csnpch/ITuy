import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'

import { ClientLocalStorage } from '../../services/localStorage/client'

// Interfaces
import { ClientObjectInterface, ClientInterface } from '@/interfaces/client';

const initialState: ClientObjectInterface = {
    dataClient: null
}

export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setDataClient: (state, action: PayloadAction<ClientInterface | null>) => {
            state.dataClient = action.payload
        },
        fetchDataClientFromStorage: (state) => {
            state.dataClient = ClientLocalStorage.getDataClient()
        },
    },
})


export const getDataClient = (state: RootState): ClientObjectInterface['dataClient'] | null => state.client.dataClient;


export const {
    setDataClient,
    fetchDataClientFromStorage
} = clientSlice.actions
export default clientSlice.reducer