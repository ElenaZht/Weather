import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isSearchOpen: false,
    searchTherm: ''
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchIsOpen: (state, action) => {
            state.isSearchOpen = action.payload
        },
        setSearchTherm: (state, action) => {
            state.searchTherm = action.payload
        }
    }
})

export const { setSearchIsOpen, setSearchTherm } = searchSlice.actions
export default searchSlice.reducer