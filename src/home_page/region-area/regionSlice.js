import { createSlice } from "@reduxjs/toolkit";
const cityTimezones = require('city-timezones'); 


export const defaultRegion = {
    regionName: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] || 'Unknown',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    country: cityTimezones.lookupViaCity(Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1])[0].iso2 || 'Unknown'
};

const loadRegionsFromLocalStorage = () => {
    if (localStorage.user) {
        const owner = JSON.parse(localStorage.user).email;
        const savedRegions = localStorage.getItem(owner + "_myRegions");
        return savedRegions ? JSON.parse(savedRegions) : [];
    }
    return [];
};

const initialState = {
    currentRegion: defaultRegion,
    myRegions: loadRegionsFromLocalStorage(),
}

const regionSlice = createSlice({
    name: 'region',
    initialState,
    reducers: {
        setCurrentRegion: (state, action) => {
            state.currentRegion = { ...action.payload }
        },
        addRegion: (state, action) => {
            const name = action.payload;
            if (localStorage.user) {
                const owner = JSON.parse(localStorage.user).email;
                const myRegionsFromLOcalStorage = JSON.parse(localStorage.getItem(owner + "_myRegions")) || [];
        
                // Check for duplicates
                if (!myRegionsFromLOcalStorage.find(r => r.regionName === name.split(',')[0])) {
                    const newRegion = { regionName: name.split(',')[0], country: name.split(',')[1] };
        
                    // Update the local myRegions array
                    myRegionsFromLOcalStorage.push(newRegion);

                    // Update localStorage
                    localStorage.setItem(owner + "_myRegions", JSON.stringify(myRegionsFromLOcalStorage));

                    // Update Redux state
                    state.myRegions = myRegionsFromLOcalStorage;
        
                }
            }
        },
        deleteRegion: (state, action) => {
            const name = action.payload
            if (localStorage.user) {
                const owner = JSON.parse(localStorage.user).email;
                const myRegions = JSON.parse(localStorage.getItem(owner + "_myRegions")) || [];
                myRegions.splice(myRegions.findIndex(r => r.regionName ===  name.split(',')[0]), 1);

                //localStorage update
                localStorage.setItem(owner + "_myRegions", JSON.stringify(myRegions));

                // state update
                state.myRegions = myRegions
            }
        }

        
    }
})

export const { setCurrentRegion, addRegion, deleteRegion } = regionSlice.actions
export default regionSlice.reducer