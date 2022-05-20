import React, {useContext, useEffect, useState} from 'react';
import classes from './saved-regions.module.css';
import MyButton from '../../components/MyButton';
import Modal from "../header-component/modal";
import RegionService from '../../components/region-service';
import RegionContext from '../../components/region-context';


const SavedRegions = ({regions}) => {

    const {region, setRegion} = useContext(RegionContext);

    let [curIdx, setCurIdx] = useState(0);
    let [disabledLeft, setDisabledLeft] = useState(true);
    let [disabledRight, setDisabledRight] = useState(false);
    let [regLimit, setRegLimit] = useState(4);
    let [isOpen, setIsOpen] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    let [curRegion, setCurRegion] = useState('');
    const regionService = RegionService.getInstance();
    let [myRegions, setMyRegions] = useState(regions);

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
    let openModal = (name) => {
        setModalActive(true);
        setIsOpen(false);
        setCurRegion(name);
    };
    let closeModal = () => {
        setModalActive(false);
        setIsOpen(true);
    };
    let deleteRegion = (current) => {
        setMyRegions(myRegions.filter(r => r.regionName !== current));
        closeModal();
    };
    let changeRegion = (name) => {
        setRegion(name);
    };

    let makeRegions = () => {
        if(myRegions && myRegions.length>0){
            let items = [];
            for(let i=0; i + curIdx <myRegions.length && i < regLimit; i++){
                items.push(
                    <div className={classes.card} key={i+curIdx} onClick={() => changeRegion(myRegions[i+curIdx])}>
                        <button className={classes.delete} onClick={() => openModal(myRegions[i+curIdx].regionName)}>x</button>
                        <div className={classes.name}>{myRegions[i+curIdx].regionName}</div>
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
            <Modal active={modalActive} setActive={setModalActive} >
                <div className={classes.dialogDel}>
                    <p>Do you want to delete {curRegion} from saved regions?</p>
                    <div className={classes.buttons}>
                        <button data-testid="delete" id="deleteBtn" className={classes.closeBtn} onClick={() => deleteRegion(curRegion)}>Delete region</button>
                        <button data-testid="close-menu" id="closeBtn" className={classes.closeBtn} onClick={closeModal}>Close</button>
                    </div>
                </div>
            </Modal>
            {myRegions.length > 4 && <div className={disabledLeft? classes.leftDisabled : classes.left} onClick={slideLeft}></div>}
            {makeRegions()}
            {myRegions.length === 0 &&  <div className={classes.noRegions}>No saved regions yet. Add?</div>}
            {myRegions.length > 4 && <div className={disabledRight? classes.rightDisabled : classes.right} onClick={slideRight}></div>}
            <div className={classes.cardBtn}>
                <MyButton sizing={{"size":'big'}}/>
            </div>
        </div>
    );
};

export default SavedRegions;
