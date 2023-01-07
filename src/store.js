import { configureStore } from '@reduxjs/toolkit'
import ActiveSlice from './Slices/ActiveSlice';
import NotificationSlice from './Slices/NotificationSlice';

const store = configureStore({
    reducer: {

        ActiveSlice: ActiveSlice,        
        notification:NotificationSlice,
    },
})

export default store

