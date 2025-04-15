import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import classes from './world-news.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGlobalNews, rotateGlobalNews } from '../news/newsSlice'

function WorldNews() {

    let [regLimit, setRegLimit] = useState(0);
    let [shown, setShown] = useState(true);
    const mode = useSelector(state => state.mode.mode)
    
    const wNews = useSelector(state => state.news.globalNews)
    const loading = useSelector(state => state.news.globalNewsLoading)
    console.log('loading',loading)
    const updateTime = useSelector(state => state.news.interval)
    const error = useSelector(state => state.news.globalNewsError)
    const dispatch = useDispatch()

    useEffect(() => {
        if(window.matchMedia("(max-width: 1024px)").matches){
            if(wNews){
                setRegLimit(1);
            }
        } else {
            setRegLimit(4);
        }
    }, [wNews]);

    useEffect(
        () => {
            // first time bring news
            dispatch(fetchGlobalNews())

            // rotate news
            let myInterval = setInterval(() => {
                if (wNews.length > 4){
                    dispatch(rotateGlobalNews())
                }

                }, 30000
            );

            

            return () => {
            
                clearInterval(myInterval);
            }
        }, [dispatch, wNews.length]
    );


    let makeWNews = useCallback(() => {
        return wNews.map((item,index) => (
            <a key={index} className={(index === 0)? [classes.wNew, classes.fadeOut].join(' ') : (index === 3)? [classes.wNew, classes.fadeIn].join(' ') : [classes.wNew]}  href={item['url']} target="_blank">{item['title']}</a>
        )).slice(0,regLimit);

    }, [wNews, regLimit]);

    return (
        <div className={shown? classes.wrapper : classes.wrapperskippedWidth}>
            <div className={classes.head}>
                <div className={classes.title}>
                    <div className={classes.thunder}></div>
                    <div className={classes.wnews}>World news</div>
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
            {shown && !!wNews.length&&<div className={classes.context}>
                {makeWNews()}
            </div>}
            {!wNews.length && !loading && shown &&<div className={classes.noContext}>Oops..Please, try again latter</div>}
        </div>
    );
}

export default WorldNews;
