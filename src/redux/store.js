import { configureStore } from "@reduxjs/toolkit";
import modeReducer from "./modeSlice";
import searchReducer from "../search_page/search-component/searchSlice"

const store = configureStore({
    reducer: {
      mode: modeReducer,
      search: searchReducer,
    },
  });
  
  export default store;