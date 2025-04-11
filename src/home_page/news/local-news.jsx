import classes from './world-news.module.css';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLocalNews, setCountry, rotateLocalNews } from '../news/newsSlice'


 const LocalNews = () => {

     let [regLimit, setRegLimit] = useState(0);
     let [shown, setShown] = useState(true);
    const loading = useSelector(state => state.news.localNewsLoading)
     const dispatch = useDispatch()
     const lNews = useSelector(state => state.news.localNews)
     const mode = useSelector(state => state.mode.mode)
     const currentRegion = useSelector(state => state.region.currentRegion)

     useEffect(()=>{
        dispatch(setCountry(currentRegion['country']))
     }, [currentRegion]);

     useEffect(() => {
            if(window.matchMedia("(max-width: 1024px)").matches){
                if(lNews){
                    setRegLimit(1);
                }
            } else {
                setRegLimit(4);
            }
    }, [dispatch]);

    useEffect(
        () => {
            // first time bring news
            dispatch(fetchLocalNews())

            // rotate news
            let myInterval = setInterval(() => {
                if (lNews.length > 4){
                    dispatch(rotateLocalNews())
                }

                }, 30000
            );

            return () => {
}
                clearInterval(myInterval);
            }, [dispatch, lNews]
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
