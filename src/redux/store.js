import { combineReducers, configureStore } from "@reduxjs/toolkit";
import modeReducer from "./modeSlice";
import searchReducer from "../search_page/search-component/searchSlice"
import regionReducer from '../home_page/region-area/regionSlice'
import weatherReducer from '../home_page/weather-component/weatherSlice'
import newsReducer from '../home_page/news/newsSlice'

const appReducer = combineReducers({
  mode: modeReducer,
  search: searchReducer,
  region: regionReducer,
  weather: weatherReducer,
  news: newsReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'app/reset') {
    return appReducer(undefined, action); // resets the entire state
  }
  return appReducer(state, action); // normal state update
};


const store = configureStore({
    reducer: rootReducer
  });
  
  export default store;