import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import classes from './world-news.module.css';
import NewsService from '../../components/news-service.js';
import ColorThemeContex from "../color-theme-context";

function WorldNews() {
    let [wNews, setWNews] = useState([]);
    let subscription = useRef(null);
    const newsService = NewsService.getInstance();
    let [regLimit, setRegLimit] = useState(0);
    let [shown, setShown] = useState(true);
    let [skippedWidth, setSkippedWidth] = useState('10%');
    let [notSkippedWidth, setNotSkippedWidth] = useState('100%');
    let [loading, setLoading] = useState(true);
    const {theme, setTheme} = useContext(ColorThemeContex);


    useEffect(() => {
        if(window.matchMedia("(max-width: 1024px)").matches){
            if(wNews){
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
                setWNews(prevValue => {
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
            subscription.current = newsService.getSubscriber().subscribe(
                (res) => {
                    if (res && res.data) {
                        // console.log(res.data['articles'])
                        setWNews(res.data['articles']);
                        setLoading(false);
                    } else if(res && res.message) {
                        console.log('error', res);
                        setLoading(false);

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
    let makeWNews = useCallback(() => {
        return wNews.map((item,index) => (
            <a key={index} className={(index === 0)? [classes.wNew, classes.fadeOut].join(' ') : (index === 3)? [classes.wNew, classes.fadeIn].join(' ') : [classes.wNew]}  href={item['url']} target="_blank">{item['title']}</a>
        )).slice(0,regLimit);

    }, [wNews]);
    return (
        <div className={classes.wrapper} style={{'height' : shown? notSkippedWidth : skippedWidth}}>
            <div className={classes.head}>
                <div className={classes.title}>
                    <div className={classes.thunder}></div>
                    <div className={classes.wnews}>World news</div>
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
                {makeWNews()}
            </div>}
            {!wNews.length && !loading &&<div className={classes.noContext}>Oops..Please, try again latter</div>}
        </div>
    );
}

export default WorldNews;
