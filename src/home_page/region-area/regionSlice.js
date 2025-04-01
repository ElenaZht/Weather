import { createSlice } from "@reduxjs/toolkit";
import RegionService from '../../services/region-service';

const regionService =  RegionService.getInstance();
const initialState = {
    currentRegion: regionService.defaultRegion
}

const regionSlice = createSlice({
    name: 'region',
    initialState,
    reducers: {
        setCurrentRegion: (state, action) => {
            state.currentRegion = action.payload
        }
    }
})

export const { setCurrentRegion } = regionSlice.actions
export default regionSlice.reducer