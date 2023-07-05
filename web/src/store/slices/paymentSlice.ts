import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'

// Interfaces
import { PaymentMethodInterface, PaymentObjectInterface } from '@/interfaces/payment'

interface UpdateStatusMethodInterface {
    id: string,
    status: number
}





const initialState: PaymentObjectInterface = {
    payment: null,
    payment_method: null
}


export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // Method
        setPaymentMethod: (state, action: PayloadAction<PaymentMethodInterface[] | null>) => {
            state.payment_method = 
                action.payload?.sort((_, b) => (b.status ? 1 : -1)) ?? []
        },
        addPaymentMethod: (state, action: PayloadAction<PaymentMethodInterface>) => {
            state.payment_method?.unshift(action.payload)
        },
        updateStatusPaymentmethod: (state, action: PayloadAction<UpdateStatusMethodInterface>) => {
            const methodUpdate = state.payment_method?.find(item => item.id === action.payload.id);
            if (!methodUpdate) return
            methodUpdate.status = action.payload.status;
        },
        removePaymentMethod: (state, action: PayloadAction<PaymentMethodInterface['id']>) => {
            if (!state.payment_method) return
            state.payment_method = state.payment_method?.filter(method => method.id !== action.payload)
        }
            
    },
})


export const getDataPayment = (
    state: RootState
): PaymentObjectInterface | null => state.payment


export const {
    setPaymentMethod,
    addPaymentMethod,
    updateStatusPaymentmethod,
    removePaymentMethod,
} = paymentSlice.actions
export default paymentSlice.reducer