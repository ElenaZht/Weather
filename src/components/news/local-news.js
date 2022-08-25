import classes from './world-news.module.css';
import NewsService from '../../components/news-service.js';

import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import RegionContext from "../region-context";
import ColorThemeContex from "../color-theme-context";


 const LocalNews = () => {
     const{region, setRegion} = useContext(RegionContext);
     let [lNews, setLNews] = useState([]);
     let subscription = useRef(null);
     const newsService = NewsService.getInstance();
     let [regLimit, setRegLimit] = useState(0);
     let [shown, setShown] = useState(true);
     let [skippedWidth, setSkippedWidth] = useState('10%');
     let [notSkippedWidth, setNotSkippedWidth] = useState('100%');
     let [loading, setLoading] = useState(true);
     const {theme, setTheme} = useContext(ColorThemeContex);

     useEffect(()=>{
         // console.log('country is ', region['country']);
         newsService.setCountry(region['country']);
     }, [region])

     useEffect(() => {
            if(window.matchMedia("(max-width: 1024px)").matches){
                if(lNews){
                    setRegLimit(1);
                    setNotSkippedWidth('20%')
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
                subscription.current = newsService.getSubscriber2(region).subscribe(
                    (res) => {
                        if(res){
                            // console.log('res.dataL', res)
                            if (res && res.data) {
                                // console.log(res.data['articles'])
                                setLNews(res.data['articles']);
                                setLoading(false);
                            } else if(res && res.message) {
                                console.log('error', res);
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
            // console.log('news for ', region.regionName, lNews)
            return lNews.map((item,index) => (
                <a key={index} className={(index === 0)? [classes.wNew, classes.fadeOut].join(' ') : (index === 3)? [classes.wNew, classes.fadeIn].join(' ') : [classes.wNew]}  href={item['url']} target="_blank">{item['title']}</a>
            )).slice(0,regLimit);

        }, [lNews]);
        return (
            <div className={classes.wrapperL} style={{'height' : shown? notSkippedWidth : skippedWidth}}>
                <div className={classes.head}>
                    <div className={classes.title}>
                        <div className={classes.thunder}></div>
                        <div className={classes.wnews}>Local news</div>
                    </div>
                    <button className={theme==='night'? classes.skipBtnNight: classes.skipBtn} onClick={()=>setShown(!shown)}></button>
                </div>
                {loading && <div className={classes.spinner}>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>}
                {shown &&<div className={classes.context}>
                    {makeLNews()}
                </div>}
                {!lNews.length && !loading &&<div className={classes.noContext}>Sorry, news for region {region['country']} not supported yet.</div>}
            </div>
    );
};

export default LocalNews;
