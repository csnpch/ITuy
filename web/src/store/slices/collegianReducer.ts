import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'
import { 
    CollegianObjectInterface, 
    SectionInterface 
} from '@/interfaces/collegian'


const initialState: CollegianObjectInterface = {
    section: null,
    yearStd: null
}

export const collegianSlice = createSlice({
    name: 'collegian',
    initialState,
    reducers: {
        // Year
        setYearStd: (
            state, 
            action: PayloadAction<CollegianObjectInterface['yearStd'] | null>
        ) => {
            state.yearStd = action.payload
        },
        addYearStd: (state, action: PayloadAction<number>) => {
            state.yearStd?.push(action.payload) 
        },
        removeYearStd: (state, action: PayloadAction<number>) => {
            if (!state.yearStd) return
            state.yearStd = state.yearStd.filter(value => value !== action.payload)
        },
        // Section
        setSection: (
            state,
            action: PayloadAction<CollegianObjectInterface['section'] | null>
        ) => {
            state.section = action.payload
        },
        addSection: (state, action: PayloadAction<SectionInterface>) => {
            state.section?.push(action.payload) 
        },
        removeSection: (state, action: PayloadAction<SectionInterface['id']>) => {
            if (!state.section) return
            state.section = state.section.filter(sec => sec.id !== action.payload)
        }
    },
})



export const getDataCollegian = (state: RootState)
    : CollegianObjectInterface | null => state.collegian


export const {
    setYearStd,
    setSection
} = collegianSlice.actions
export default collegianSlice.reducer