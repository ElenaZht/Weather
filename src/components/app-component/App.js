import React, {useEffect, useState} from 'react';
import './app.css';
import Header from '../header-component/header.js';
import RegionArea from '../region-area/region-area';
import RegionService from '../../components/region-service'
import SavedRegions from '../../components/saved-regions/saved-regions.js';
import RegionContext from '../../components/region-context';
import SearchContext from '../../components/search-context';
import SearchComponent from '../../components/search-component/search-component';
import SearchTermContext from '../../components/search-term-context';

function App() {
    const regionService =  RegionService.getInstance();
    const defaultRegion = regionService.defaultRegion;
    const [savedRegions, setSavedRegions] = useState(regionService.getMyRegions());
    const [region, setRegion] = useState( defaultRegion);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(false);


    return (
        <div className="App">
            <SearchContext.Provider value={{searchOpen, setSearchOpen}}>
                <div className="container">
                    <SearchTermContext.Provider value={{searchTerm, setSearchTerm}}>
                        <Header/>
                        {searchOpen? (
                            <SearchComponent regions={savedRegions}/>
                        ):(
                            <RegionContext.Provider value={{region, setRegion}}>
                                <RegionArea/>
                                <div className="wrapper">
                                    <SavedRegions regions={savedRegions}/>
                                </div>
                                <p className="signature">Elena Zhytomirskaya, 2022</p>
                            </RegionContext.Provider>
                        )}
                    </SearchTermContext.Provider>


                </div>
            </SearchContext.Provider>
        </div>
    );
}

export default App;
