class RegionService{
    _instance;
    defaultRegion = {
        regionName: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1],
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    static getInstance(){
        if(!RegionService._instance){
            RegionService._instance = new RegionService();
        }
        return RegionService._instance;
    }
    deleteRegion(name){
        console.log('delete region')
        const myRegions = JSON.parse(localStorage.getItem("myRegions")) || [];
        myRegions.splice(myRegions.findIndex(r => r.regionName ===  name.split(',')[0]), 1);
        localStorage.setItem("myRegions", JSON.stringify(myRegions));
        return myRegions;
    }
    addRegion(name){
        const myRegions = JSON.parse(localStorage.getItem("myRegions")) || [];
        if(myRegions.find(r => r.regionName === name.split(',')[0])){
            alert('`name` was already added') //todo: fix name
        } else {
            myRegions.push({regionName: name.split(',')[0]});
            localStorage.setItem("myRegions", JSON.stringify(myRegions));
            console.log('service added region')
        }
        return myRegions;
    }
    getMyRegions(){
        const myRegions =  JSON.parse(localStorage.getItem("myRegions")) || [];
        return myRegions
    }

}

export default RegionService;
