import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    interval: 600000, // 10 minutes
    city: '',
    weather: {},
    status: '',
    error: '',
    loading: false
}

export const fetchWeather = createAsyncThunk('weather/fetch', 
    async (city, { rejectWithValue }) => {
        try {
            const pref = window.location.protocol + '//api.themove.fun/weather?q=';
            // const pref = 'https://api.openweathermap.org/data/2.5/weather?q=';// < -- proxy
            const postf = '&units=metric&appid=';
            const key = 'eb8340c39e25e9a743e2f50e800f1bb3';
            // const response = await fetch(pref + city.toLowerCase() + postf + key)// < -- proxy
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city.toLowerCase() + postf + key) // < -- localhost

            if (!response.ok){
                return rejectWithValue('Failed to fetch weather');
            }
            const data = await response.json()
            
            return data

        } catch (error) {

            return rejectWithValue(error.message);
        }

})

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setCity: (state, action) => {
            state.city = action.payload.city
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state, action) => {
                state.status = 'loading'
                state.error = '';
                state.loading = true
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.weather = action.payload
                state.loading = false
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
                state.loading = false
            })
    }
})

export const { setCity } = weatherSlice.actions
export default weatherSlice.reducer