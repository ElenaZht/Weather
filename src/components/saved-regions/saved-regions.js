import React, {useCallback, useContext, useEffect, useState} from 'react';
import classes from './saved-regions.module.css';
import MyButton from '../../components/MyButton';
import Modal from "../header-component/modal";
import RegionService from '../../components/region-service';
import RegionContext from '../../components/region-context';
import SearchContext from '../../components/search-context';
import Card from '../../components/card-component/card';


const SavedRegions = ({regions, deleteMethod, closeDialog}) => {
    const regionService =  RegionService.getInstance();
    const defaultRegion = regionService.defaultRegion;

    const {region, setRegion} = useContext(RegionContext);
    const {searchOpen, setSearchOpen} = useContext(SearchContext);

    let [curIdx, setCurIdx] = useState(0);
    let [disabledLeft, setDisabledLeft] = useState(true);
    let [disabledRight, setDisabledRight] = useState(false);
    let [regLimit, setRegLimit] = useState(3);
    let [isOpen, setIsOpen] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    let [curRegion, setCurRegion] = useState('');
    let [myRegions, setMyRegions] = useState(regions);
    let [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
         if(window.matchMedia("(max-width: 1024px)").matches){
            if(regions){
                setRegLimit(regions.length);
                setIsMobile(true)
            }

         } else {
             setRegLimit(3);
         }
    });
    // useEffect(() => {
    //     makeRegions();
    // }, [localStorage.getItem('user')]
    // );



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
        if(curIdx < regions.length - 3){
            setCurIdx(++curIdx);
        }
        if(curIdx === regions.length - 3){
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
        deleteMethod(current);
        closeModal();
    };

    let openSearch = () => {
        setSearchOpen(true);
    };
    let openSearchMobile = () => {
        closeDialog(); // not a func error
        setSearchOpen(true);
    };
    let makeRegions = () => {
        if(myRegions && myRegions.length>0){
            let items = [];
            for(let i=0; i + curIdx <myRegions.length && i < regLimit; i++){
                items.push(
                    <Card status={1} key={i + curIdx} city={myRegions[i + curIdx].regionName}
                        openModalMethod={openModal}
                          closeDialogMethod={closeDialog}
                    />
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
            {(myRegions && myRegions.length) > 3 && <div className={disabledLeft? classes.leftDisabled : classes.left} onClick={slideLeft}></div>}
            {/*<Card  city={defaultRegion.regionName}*/}
            {/*      openModalMethod={openModal}*/}
            {/*      closeDialogMethod={closeDialog}*/}
            {/*/>*/}
            <Card city={defaultRegion.regionName} status={0}/>
            {makeRegions()}
            {(myRegions && myRegions.length) === 0 &&  <div className={classes.noRegions}>No saved regions yet. Add?</div>}
            {(myRegions && myRegions.length) > 3 && <div className={disabledRight? classes.rightDisabled : classes.right} onClick={slideRight}></div>}
            {isMobile?
                (<div className={classes.cardBtn} onClick={openSearchMobile}>
                    <MyButton sizing={{"size":'big'}} />
                </div>) :
                (<div className={classes.cardBtn} onClick={openSearch}>
                    <MyButton sizing={{"size":'big'}} />
                </div>)
            }

        </div>
    );
};

export default SavedRegions;
