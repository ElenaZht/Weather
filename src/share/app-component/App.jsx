import React, {useState} from 'react';
import './app.css';
import Header from '../../home_page/header-component/header';
import RegionArea from '../../home_page/region-area/region-area';
import SavedRegions from '../saved-regions/saved-regions';
import SearchComponent from '../../search_page/search-component/search-component';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux"; 
import { addRegion, deleteRegion } from '../../home_page/region-area/regionSlice.js'


function App() {
    const savedRegions = useSelector(state => state.region.myRegions);
    const dispatch = useDispatch()

    const mode = useSelector(state => state.mode.mode);
    const isSearchOpen = useSelector(state => state.search.isSearchOpen)


    let deleteThisRegion = (city) => {
        dispatch(deleteRegion(city))
        toast.success(`${city} is deleted from your regions.`);
    };


    let addThisRegion = (city) => {
        if(localStorage.user){
            let afterAdd = dispatch(addRegion(city));
            if(afterAdd){
                toast.success(`${city} is added to your regions.`);
            } else {
                toast.warn(`${city} already added to your regions!`);
            }
            return afterAdd
        } else {
            toast.warn('For adding new regions please log in!  ')
        }
    };


    return (
        <div className={`${mode==='night' ? "App-night" : "App"}`}>
            <ToastContainer
                draggable={false}
                transition={Zoom}
                autoClose={5000}
                position={"top-center"}
                hideProgressBar
                newestOnTop
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
                theme={"colored"}

            />
                        <div className="container">
                                <Header deleteMethod={deleteThisRegion}/>
                                {isSearchOpen? (
                                    <SearchComponent key={savedRegions.length} regions={savedRegions} deleteMethod={deleteThisRegion} addMethod={addThisRegion}/>
                                ):(
                                    <>
                                        <RegionArea/>
                                        <div className="wrapper">
                                                <SavedRegions key={savedRegions.length+10} regions={savedRegions} deleteMethod={deleteThisRegion}/>
                                            </div>
                                            <p className="signature">Elena Zhytomirskaya, 2025</p>
                                        </>
                                        

                                )}


                        </div>

        </div>
    );
}

export default App;
