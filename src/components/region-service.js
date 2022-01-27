class RegionService{
    _instance;
    static getInstance(){
        if(!RegionService._instance){
            RegionService._instance = new RegionService();
        }
        return RegionService._instance;
    }
    defaultRegion = {
        regionName: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1],
        date: new Date().getHours() + ":" + new Date().getMinutes() + "  "+ new Date().getDate() + " " + new Date().toDateString().split(" ")[1] + " " + new Date().getFullYear()
    };
    myRegions = [
        {regionName: 'Minsk', date: '13:05 21 Jun 2022'},
        {regionName: 'Holon', date: '12:05 21 Jun 2022'},
        {regionName: 'Tel Aviv', date: '12:05 21 Jun 2022'},
        {regionName: 'Mogilev', date: '13:05 21 Jun 2022'},
        {regionName: 'Moscow', date: '13:05 21 Jun 2022'},
        {regionName: 'Kiev', date: '13:05 21 Jun 2022'},
    ]

}

export default RegionService;
