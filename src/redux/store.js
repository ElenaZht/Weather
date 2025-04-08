import { configureStore } from "@reduxjs/toolkit";
import modeReducer from "./modeSlice";
import searchReducer from "../search_page/search-component/searchSlice"
import regionReducer from '../home_page/region-area/regionSlice'
import weatherReducer from '../home_page/weather-component/weatherSlice'

const store = configureStore({
    reducer: {
      mode: modeReducer,
      search: searchReducer,
      region: regionReducer,
      weather: weatherReducer
    },
  });
  
  export default store;