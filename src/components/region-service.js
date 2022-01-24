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
}

export default RegionService;
