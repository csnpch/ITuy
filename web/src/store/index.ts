import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import clientReducer from './slices/clientSlice'
import collegianReducer from './slices/collegianReducer'
import paymentReducer from './slices/paymentSlice'
import billReducer from './slices/billSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
    collegian: collegianReducer,
    payment: paymentReducer,
    bill: billReducer
  },
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch