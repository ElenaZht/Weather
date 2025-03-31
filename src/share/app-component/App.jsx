import React, {useState} from 'react';
import './app.css';
import Header from '../../home_page/header-component/header';
import RegionArea from '../../home_page/region-area/region-area';
import RegionService from '../../services/region-service.js';
import SavedRegions from '../saved-regions/saved-regions';
import RegionContext from '../../contexts/region-context.js';
import SearchContext from '../../contexts/search-context.js';
import SearchComponent from '../../search_page/search-component/search-component';
import SearchTermContext from '../../contexts/search-term-context.js';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux"; 


function App() {
    const regionService =  RegionService.getInstance();
    const defaultRegion = regionService.defaultRegion;
    const [savedRegions, setSavedRegions] = useState(regionService.getMyRegions());
    const [region, setRegion] = useState( defaultRegion);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const mode = useSelector((state) => state.mode.mode);


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
                <SearchContext.Provider value={{searchOpen, setSearchOpen}}>
                    <RegionContext.Provider value={{region, setRegion}}>
                        <div className="container">
                            <SearchTermContext.Provider value={{searchTerm, setSearchTerm}}>
                                <Header userChangedCallback={getMyRegions} deleteMethod={deleteRegion}/>
                                {searchOpen? (
                                    <SearchComponent key={savedRegions.length} regions={savedRegions} deleteMethod={deleteRegion} addMethod={addRegion}/>
                                ):(
                                    <RegionContext.Provider value={{region, setRegion}}>
                                        <RegionArea/>
                                        <div className="wrapper">
                                            <SavedRegions key={savedRegions.length+10} regions={savedRegions} deleteMethod={deleteRegion}/>
                                        </div>
                                        <p className="signature">Elena Zhytomirskaya, 2022</p>
                                    </RegionContext.Provider>
                                )}
                            </SearchTermContext.Provider>


                        </div>
                    </RegionContext.Provider>
                </SearchContext.Provider>

        </div>
    );
}

export default App;
