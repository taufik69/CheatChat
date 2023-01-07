import { createSlice } from '@reduxjs/toolkit'

export const ActiveSlice = createSlice({
    name: 'ActiveSlice',
    initialState: {
        Active: 'taufik',

    },

    reducers: {

        ActiveChat: (state, action) => {
            state.Active = action.payload
        },

    },
})


export const { ActiveChat } = ActiveSlice.actions

export default ActiveSlice.reducer