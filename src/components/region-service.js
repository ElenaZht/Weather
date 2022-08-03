class RegionService{
    cityTimezones = require('city-timezones');
    _instance;
    defaultRegion = {
        regionName: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1],
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ,
        country: this.cityTimezones.lookupViaCity(Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1])[0].iso2
};

    static getInstance(){
        if(!RegionService._instance){
            RegionService._instance = new RegionService();
        }
        return RegionService._instance;
    }
    deleteRegion(name){
        if(!localStorage.user) return [];
        const owner = JSON.parse(localStorage.user).email;
        const myRegions = JSON.parse(localStorage.getItem(owner + "_myRegions")) || [];
        myRegions.splice(myRegions.findIndex(r => r.regionName ===  name.split(',')[0]), 1);
        localStorage.setItem(owner + "_myRegions", JSON.stringify(myRegions));
        return myRegions;
    }
    addRegion(name){
        if(!localStorage.user) return [];
        const owner = JSON.parse(localStorage.user).email;
        const myRegions = JSON.parse(localStorage.getItem(owner + "_myRegions")) || [];
        if(myRegions.find(r => r.regionName === name.split(',')[0])){
            return null;
        } else {
            myRegions.push({regionName: name.split(',')[0], country: name.split(',')[1]});
            console.log('region service add region with country', name.split(',')[1]);
            localStorage.setItem(owner + "_myRegions", JSON.stringify(myRegions));
        }
        return myRegions;
    }
    getMyRegions(){
        if(!localStorage.user) return [];
        const owner = JSON.parse(localStorage.user).email;
        const myRegions =  JSON.parse(localStorage.getItem(owner + "_myRegions")) || []
        return myRegions
    }

}

export default RegionService;
