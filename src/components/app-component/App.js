import React, {useState} from 'react';
import './app.css';
import Header from '../header-component/header.js';
import RegionArea from '../region-area/region-area';
import RegionService from '../../components/region-service'
import SavedRegions from '../../components/saved-regions/saved-regions.js';

function App() {
    const regionService =  RegionService.getInstance();
    const defaultRegion = regionService.defaultRegion;
    const savedRegions = regionService.myRegions;
    const [region, setRegion] = useState(localStorage.location? JSON.parse(localStorage.location) : defaultRegion);
  return (
    <div className="App">
      <div className="container">
        <Header/>
        <RegionArea region={region}/>
        <div className="wrapper">
            <SavedRegions regions={savedRegions}/>
        </div>
        <p className="signature">Elena Zhytomirskaya, 2022</p>
      </div>
    </div>
  );
}

export default App;
