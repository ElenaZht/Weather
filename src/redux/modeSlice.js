import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "day",
}

const modeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers : {
        setMode: (state, action) => {
            state.mode = action.payload
        },
    }
})

export const { setMode } = modeSlice.actions
export default modeSlice.reducer