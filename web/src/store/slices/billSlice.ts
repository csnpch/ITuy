import { BillInterface, BillObjectInterface } from '@/interfaces/bill'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'
import { billDict } from '@/data/dict/bill_dict'


const initialState: BillObjectInterface = {
    dataBill: null,
    pagination: null
}


export const billSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        setDataBill: (state, action: PayloadAction<BillInterface[]>) => {
            state.dataBill = action.payload
            billSlice.caseReducers.filter(state)
        },
        addDataBill: (state, action: PayloadAction<BillInterface>) => {
            state.dataBill?.unshift(action.payload)
        },
        updateStatusBill: (state, action: PayloadAction<{ 
            id: string,
            status: number|null
        }>) => {
            const { id, status } = action.payload
            const billUpdate = state.dataBill?.find(item => item.id === id)
            if (!billUpdate) return
            billUpdate.status = status
            billSlice.caseReducers.filter(state)
        },
        filter: (state) => {
            const billAppove = state.dataBill?.filter(item => item.status === billDict.appove.status)
            const billCancel = state.dataBill?.filter(item => item.status === billDict.cancel.status)
            const billHold = state.dataBill?.filter(item => item.status === billDict.hold.status)
            const billClose = state.dataBill?.filter(item => item.status === billDict.close.status)
        
            state.dataBill = [
                ...billAppove!,
                ...billHold!,
                ...billClose!,
                ...billCancel!,
            ]
        },
        // pagination
        setPaginationBill: (state, action: PayloadAction<BillObjectInterface['pagination']>) => {
            state.pagination = action.payload
        },
    },
})


export const getDataBill = (state: RootState): BillObjectInterface['dataBill'] => state.bill.dataBill
export const getPaginationBill = (state: RootState): BillObjectInterface['pagination'] => state.bill.pagination


export const {
    setDataBill,
    addDataBill,
    updateStatusBill,
    // pagination
    setPaginationBill,
} = billSlice.actions

export default billSlice.reducer