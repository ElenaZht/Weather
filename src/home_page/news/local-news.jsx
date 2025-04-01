import classes from './world-news.module.css';
import NewsService from '../../services/news-service.js';
import React, {useCallback, useEffect, useRef, useState} from 'react';
// import RegionContext from "../../contexts/region-context.js";
import { useSelector } from 'react-redux';


 const LocalNews = () => {
    //  const{region, setRegion} = useContext(RegionContext);
     let [lNews, setLNews] = useState([]);
     let subscription = useRef(null);
     const newsService = NewsService.getInstance();
     let [regLimit, setRegLimit] = useState(0);
     let [shown, setShown] = useState(true);
     let [loading, setLoading] = useState(true);
     const mode = useSelector(state => state.mode.mode)
     const currentRegion = useSelector(state => state.region.currentRegion)

     useEffect(()=>{
         newsService.setCountry(currentRegion['country']);
     }, [currentRegion]);

     useEffect(() => {
            if(window.matchMedia("(max-width: 1024px)").matches){
                if(lNews){
                    setRegLimit(1);
                }
            } else {
                setRegLimit(4);
            }
        });

        useEffect(
            () => {
                let myInterval = setInterval(() => {
                        setLNews(prevValue => {
                            if (prevValue.length > 4) {
                                let tempArr = prevValue;
                                const first = tempArr.shift();
                                return [...tempArr, first];
                            } else {
                                return prevValue;
                            }
                        });

                    }, 30000
                );
                subscription.current = newsService.getSubscriber2(currentRegion).subscribe(
                    (res) => {
                        if(res){
                            if (res && res.data) {
                                setLNews(res.data['articles']);
                                setLoading(false);
                            } else if(res && res.message) {
                                console.error('error', res);
                                setLNews([]);
                                setLoading(false);

                            }
                            else if(!res.data){
                                setLNews([]);
                                setLoading(false);
                            }
                        }

                    }
                );

                return () => {
                    if (subscription.current) {
                        subscription.current.unsubscribe();
                    }
                    clearInterval(myInterval);
                }
            }, []
        );

        let makeLNews = useCallback(() => {
            return lNews.map((item,index) => (
                <a key={index} className={(index === 0)? [classes.wNew, classes.fadeOut].join(' ') : (index === 3)? [classes.wNew, classes.fadeIn].join(' ') : [classes.wNew]}  href={item['url']} target="_blank">{item['title']}</a>
            )).slice(0,regLimit);

        }, [lNews]);
        return (
            <div className={shown? classes.wrapperL : classes.wrapperLskippedWidth}>
                <div className={classes.head}>
                    <div className={classes.title}>
                        <div className={classes.thunder}></div>
                        <div className={classes.wnews}>Local news</div>
                    </div>
                    {shown &&<button className={mode==='night'? classes.skipBtnNight: classes.skipBtn} onClick={()=>setShown(!shown)}>hide</button>}
                    {!shown &&<button className={mode==='night'? classes.skipBtnNight: classes.skipBtn} onClick={()=>setShown(!shown)}>show</button>}
                </div>
                {loading && <div className={classes.spinner}>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>}
                {shown && !!lNews.length&&<div className={classes.context}>
                    {makeLNews()}
                </div>}
                {!lNews.length && !loading && shown &&<div className={classes.noContext}>Sorry, no news for region {currentRegion['country']} was found.</div>}
            </div>
    );
};

export default LocalNews;
