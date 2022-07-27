import React, {useEffect, useRef, useState} from 'react';
import classes from './world-news.module.css';
import NewsService from '../../components/news-service.js';

function WorldNews() {
    let [wNews, setWNews] = useState([]);
    let subscription = useRef(null);
    const newsService = NewsService.getInstance();
    let [curIdx, setCurIdx] = useState(0);
    let [regLimit, setRegLimit] = useState(0);
    let [shown, setShown] = useState(true);
    let [skippedWidth, setSkippedWidth] = useState('10%');
    let [notSkippedWidth, setNotSkippedWidth] = useState('100%');
    let [loading, setLoading] = useState(true);

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
            }
        }, []
    );
    let makeWNews = () => {
        if(wNews && wNews.length>0){
            let items = [];
            for(let i=0; i + curIdx <wNews.length && i < regLimit; i++){
                items.push(
                    <a key={i + curIdx} className={classes.wNew} href={wNews[i + curIdx]['url']} target="_blank">{wNews[i + curIdx]['description']}</a>
                )
            }
            console.log('wnews :', items)
            return items;
        }
    };
    return (
        <div className={classes.wrapper} style={{'height' : shown? notSkippedWidth : skippedWidth}}>
            <div className={classes.head}>
                <div className={classes.title}>
                    <div className={classes.thunder}></div>
                    <div className={classes.wnews}>World news</div>
                </div>
                <button className={classes.skipBtn} onClick={()=>setShown(!shown)}></button>
            </div>
            {loading && <div className={classes.spinner}>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>}
            {!!wNews.length && shown &&<div className={classes.context}>
                {makeWNews()}
            </div>}
            {!wNews.length && !loading &&<div className={classes.noContext}>Oops..Please, try again latter</div>}
        </div>
    );
}

export default WorldNews;
