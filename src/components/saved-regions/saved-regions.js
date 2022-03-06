import React, {useEffect, useState} from 'react';
import classes from './saved-regions.module.css';
import MyButton from '../../components/MyButton';

const SavedRegions = ({regions}) => {
    let [curIdx, setCurIdx] = useState(0);
    let [disabledLeft, setDisabledLeft] = useState(true);
    let [disabledRight, setDisabledRight] = useState(false);
    let [regLimit, setRegLimit] = useState(4);

    useEffect(() => {
         if(window.matchMedia("(max-width: 1024px)").matches){
            setRegLimit(regions.length)
         } else {
             setRegLimit(4)
         }
    });
    let slideLeft = () => {
        if(curIdx > 0){
            setCurIdx(--curIdx);
        }
        if(curIdx === 0){
            setDisabledLeft(true);
        }
        setDisabledRight(false);

    };
    let slideRight = () => {
        if(curIdx < regions.length - 4){
            setCurIdx(++curIdx);
        }
        if(curIdx === regions.length - 4){
            setDisabledRight(true);
        }
        setDisabledLeft(false);

    };
    let makeRegions = () => {
        if(regions && regions.length>0){
            let items = [];
            for(let i=0; i + curIdx <regions.length && i < regLimit; i++){
                items.push(
                    <div className={classes.card} key={i+curIdx}>
                        <div className={classes.name}>{regions[i+curIdx].regionName}</div>
                        <div className={classes.info}>
                            <div className={classes.icon}></div>
                            <div className={classes.degree}>+25°</div>
                        </div>

                    </div>
                )
            }
            return items;
        }

    };


    return (
        <div className={classes.wrap}>
            {regions.length > 4 && <div className={disabledLeft? classes.leftDisabled : classes.left} onClick={slideLeft}></div>}
            {makeRegions()}
            {regions.length === 0 &&  <div className={classes.noRegions}>No saved regions yet. Add?</div>}
            {regions.length > 4 && <div className={disabledRight? classes.rightDisabled : classes.right} onClick={slideRight}></div>}
            <div className={classes.cardBtn}>
                <MyButton sizing={{"size":'big'}}/>
            </div>
        </div>
    );
};

export default SavedRegions;
