import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    interval: 900000, //15min
    country: '',
    globalNews: [],
    localNews: [],
    globalNewsStatus: '',
    localNewsStatus: '',
    globalNewsLoading: false,
    localNewsLoading: false,
    globalNewsError: '',
    localNewsError: ''
}
const key = '80b4557be1dd40f8b91006bf5fccdf89';


export const fetchGlobalNews = createAsyncThunk('news/fetch_global',
    async(_, { rejectWithValue }) => {
        
        try {
            // const response = await fetch(window.location.protocol + '//api.themove.fun/news/top-headlines?sources=bbc-news&apiKey=' + key) //< --- proxy
            const response = await fetch('https://newsapi.org//v2/top-headlines?sources=bbc-news&apiKey=' + key)// < --- localhost

            if (!response.ok) {
                return rejectWithValue('Failed to fetch global news');
            }

            const data = await response.json()
            return data
            
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchLocalNews = createAsyncThunk('news/fetch_local',
    async(country, { rejectWithValue }) => {
        
        try {
            // (pref + country.toLowerCase() + '&apiKey=' + key) < --- proxy
            const response = await fetch('https://newsapi.org//v2/top-headlines?country=' + country.toLowerCase() + '&apiKey=' + key)// < --- localhost

            if (!response.ok) {
                return rejectWithValue('Failed to fetch local news');
            }

            const data = await response.json()
            return data
            
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setCountry: (state, action) => {
            state.country = action.payload
        },
        rotateGlobalNews: (state) => {
            if (state.globalNews.length > 0) {
                let tempArr = [...state.globalNews];
                const first = tempArr.shift();
                state.globalNews = [...tempArr, first];
                console.log('Rotated News:', state.globalNews);

            }
        },
        rotateLocalNews: (state) => {
            if (state.localNews.length > 0) {
                let tempArr = [...state.localNews];
                const first = tempArr.shift();
                state.localNews = [...tempArr, first];
                console.log('Rotated News:', state.localNews);

            }
        },
    },
    extraReducers: (builder) => {
        /** global news from bbc */
        builder
            .addCase(fetchGlobalNews.pending, (state) => {
                state.globalNewsLoading = true
                console.log('loading',state.globalNewsLoading)

                state.globalNewsError = ''
                state.globalNewsStatus = 'loading'
            })
            .addCase(fetchGlobalNews.fulfilled, (state, action) => {
                state.globalNewsLoading = false
                console.log('loading',state.globalNewsLoading)

                state.globalNewsError = ''
                state.globalNewsStatus = 'succeeded'
                state.globalNews = action.payload.articles
                
            })
            .addCase(fetchGlobalNews.rejected, (state, action) => {
                state.globalNewsLoading = false
                console.log('loading',state.globalNewsLoading)

                state.globalNewsError = action.payload
                state.globalNewsStatus = 'failed'
            })

        builder
            .addCase(fetchLocalNews.pending, (state) => {
                state.localNewsLoading = true
                state.localNewsError = ''
                state.localNewsStatus = 'loading'
            })
            .addCase(fetchLocalNews.fulfilled, (state, action) => {
                state.localNewsLoading = false
                state.localNewsError = ''
                state.localNewsStatus = 'succeeded'
                state.localNews = action.payload.articles
            })
            .addCase(fetchLocalNews.rejected, (state, action) => {
                state.localNewsLoading = false
                state.localNewsError = action.payload
                state.localNewsStatus = 'failed'
            })
    }
})

export const { setCountry, rotateGlobalNews, rotateLocalNews } = newsSlice.actions
export default newsSlice.reducer