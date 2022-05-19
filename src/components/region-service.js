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
        this.myRegions = this.myRegions.filter(r => 'regionName' !== r.name);
        console.log(this.myRegions)
    }

    myRegions = [
        {regionName: 'Minsk', date: 'Europe/Minsk'},
        {regionName: 'Holon', date: 'Asia/Holon'},
        {regionName: 'Tel Aviv', date: 'Asia/Tel_Aviv'},
        {regionName: 'Mogilev', date: 'Europe/Mogilev'},
        {regionName: 'Moscow', date: 'Europe/Moscow'},
        {regionName: 'Kiev', date: 'Europe/Kiev'},
    ]

}

export default RegionService;
