import React, {useState} from 'react';
import './app.css';
import Header from '../../home_page/header-component/header';
import RegionArea from '../../home_page/region-area/region-area';
import RegionService from '../../services/region-service.js';
import SavedRegions from '../saved-regions/saved-regions';
// import RegionContext from '../../contexts/region-context.js';
import SearchComponent from '../../search_page/search-component/search-component';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux"; 


function App() {
    const regionService =  RegionService.getInstance();
    // const defaultRegion = regionService.defaultRegion;
    const [savedRegions, setSavedRegions] = useState(regionService.getMyRegions());
    // const [region, setRegion] = useState( defaultRegion);


    const mode = useSelector(state => state.mode.mode);
    const isSearchOpen = useSelector(state => state.search.isSearchOpen)


    let deleteRegion = (city) => {
        let afterDelete = regionService.deleteRegion(city);
        setSavedRegions(afterDelete);
        toast.success(`${city} is deleted from your regions.`);
    };


    let addRegion = (city) => {
        if(localStorage.user){
            let afterAdd = regionService.addRegion(city);
            if(afterAdd){
                setSavedRegions(afterAdd);
                toast.success(`${city} is added to your regions.`);
            } else {
                toast.warn(`${city} already added to your regions!`);
            }
            return afterAdd
        } else {
            toast.warn('For adding new regions please log in!  ')
        }
    };


    let getMyRegions = () => {
        setSavedRegions(regionService.getMyRegions())
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
                                <Header userChangedCallback={getMyRegions} deleteMethod={deleteRegion}/>
                                {isSearchOpen? (
                                    <SearchComponent key={savedRegions.length} regions={savedRegions} deleteMethod={deleteRegion} addMethod={addRegion}/>
                                ):(
                                    <>
                                        <RegionArea/>
                                        <div className="wrapper">
                                                <SavedRegions key={savedRegions.length+10} regions={savedRegions} deleteMethod={deleteRegion}/>
                                            </div>
                                            <p className="signature">Elena Zhytomirskaya, 2025</p>
                                        </>
                                        

                                )}


                        </div>

        </div>
    );
}

export default App;
