import React, {useState} from 'react';
import './app.css';
import Header from '../header-component/header.js';
import RegionArea from '../region-area/region-area';
import RegionService from '../../components/region-service'
import SavedRegions from '../../components/saved-regions/saved-regions.js';
import RegionContext from '../../components/region-context';

function App() {
    const regionService =  RegionService.getInstance();
    const defaultRegion = regionService.defaultRegion;
    const savedRegions = regionService.myRegions;
    const [region, setRegion] = useState( defaultRegion);


  return (
    <div className="App">
      <div className="container">
          <RegionContext.Provider value={{region, setRegion}}>
              <Header/>
              <RegionArea/>
              <div className="wrapper">
                  <SavedRegions regions={savedRegions}/>
              </div>
              <p className="signature">Elena Zhytomirskaya, 2022</p>
          </RegionContext.Provider>

      </div>
    </div>
  );
}

export default App;
