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
        const myRegions = JSON.parse(localStorage.getItem("myRegions")) || [];
        console.log(myRegions.findIndex(r => r.regionName ===  name.split(',')[0]));
        myRegions.splice(myRegions.findIndex(r => r.regionName ===  name.split(',')[0]), 1);
        localStorage.setItem("myRegions", JSON.stringify(myRegions));
    }
    addRegion(name){
        const myRegions = JSON.parse(localStorage.getItem("myRegions")) || [];
        if(myRegions.find(r => r.regionName === name.split(',')[0])){
            alert(' `name` was already added')
        } else {
            myRegions.push({regionName: name.split(',')[0]});
            localStorage.setItem("myRegions", JSON.stringify(myRegions));
        }

    }
    getMyRegions(){
        const myRegions =  JSON.parse(localStorage.getItem("myRegions")) || [];
        return myRegions
    }

    // myRegions = [
    //     {regionName: 'Minsk', date: 'Europe/Minsk'},
    //     {regionName: 'Holon', date: 'Asia/Holon'},
    //     {regionName: 'Tel Aviv', date: 'Asia/Tel_Aviv'},
    //     {regionName: 'Mogilev', date: 'Europe/Mogilev'},
    //     {regionName: 'Moscow', date: 'Europe/Moscow'},
    //     {regionName: 'Kiev', date: 'Europe/Kiev'},
    //     {regionName: 'Minsk', date: 'Europe/Minsk'},
    //     {regionName: 'Holon', date: 'Asia/Holon'},
    //     {regionName: 'Tel Aviv', date: 'Asia/Tel_Aviv'},
    //     {regionName: 'Mogilev', date: 'Europe/Mogilev'},
    //     {regionName: 'Moscow', date: 'Europe/Moscow'},
    //     {regionName: 'Kiev', date: 'Europe/Kiev'},
    // ]

}

export default RegionService;
