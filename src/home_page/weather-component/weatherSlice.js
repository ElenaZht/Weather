import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    interval: 600000, // 10 minutes
    city: '',
    weather: {},
    status: '',
    error: '',
    loading: false
}

export const fetchWeatherByCity = async (city) => {
    const pref = window.location.protocol + '//api.themove.fun/weather?q='; // < -- localhost
    // const pref = 'https://api.openweathermap.org/data/2.5/weather?q=';// < -- proxy
    const postf = '&units=metric&appid=';
    const key = 'eb8340c39e25e9a743e2f50e800f1bb3';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}${postf}${key}`; // < -- localhost
    // const url = `${pref} + ${city.toLowerCase()} + ${postf} + ${key}`// < -- proxy

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchWeatherForCityCard = createAsyncThunk(
    'weather/fetchWeatherForCityCard',
    async (city, { rejectWithValue }) => {
        try {
            const data = await fetchWeatherByCity(city);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchWeather = createAsyncThunk('weather/fetch', 
    async (city, { rejectWithValue }) => {
        try {
            const data = await fetchWeatherByCity(city);
            return data;

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