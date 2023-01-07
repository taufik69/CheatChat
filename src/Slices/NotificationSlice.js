import { createSlice } from "@reduxjs/toolkit";

export const NotificatonSlice = createSlice({
    name: 'notification',
    initialState: {
        Amount: 0,

    },

    reducers: {

        notification: (state, action) => {
            state.Amount = action.payload
        },

    },
})


export const { notification } = NotificatonSlice.actions

export default NotificatonSlice.reducer