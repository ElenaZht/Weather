import React, {useEffect, useRef, useState} from 'react';
import './app.css';
import Header from '../header-component/header.js';
import RegionArea from '../region-area/region-area';
import RegionService from '../../components/region-service';
import SavedRegions from '../../components/saved-regions/saved-regions.js';
import RegionContext from '../../components/region-context';
import SearchContext from '../../components/search-context';
import SearchComponent from '../../components/search-component/search-component';
import SearchTermContext from '../../components/search-term-context';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const regionService =  RegionService.getInstance();
    const defaultRegion = regionService.defaultRegion;
    const [savedRegions, setSavedRegions] = useState(regionService.getMyRegions());
    const [region, setRegion] = useState( defaultRegion);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


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

    // toast.success('yeesssss');
    // toast.error('nooo');
    // toast.info('info');
    // toast.warn('warning');

    return (
        <div className="App">
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
                            <Header userChangedCallback={getMyRegions}/>
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
