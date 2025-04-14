import React, {useContext, useEffect, useState, useCallback, useRef} from 'react';
import classes from './search-component.module.css';
import Modal from "../../home_page/header-component/modal";
import MyButton from "../../share/MyButton";
import {regionList} from '../../storages/search-storage'
import Card from "../../share/card-component/card";
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTherm } from './searchSlice.js';
import { addRegion, defaultRegion } from '../../home_page/region-area/regionSlice.js'

const pageSize = 10;
const Search = ({deleteMethod, addMethod}) => {

    let [curIdx, setCurIdx] = useState(0);
    let [disabledLeft, setDisabledLeft] = useState(true);
    let [disabledRight, setDisabledRight] = useState(false);
    let [regLimit, setRegLimit] = useState(1);
    let [isOpen, setIsOpen] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    let [curRegion, setCurRegion] = useState('');

    let myRegions = useSelector(state => state.region.myRegions)

    let [isMobile, setIsMobile] = useState(false);
    let [cities, setCities] = useState(regionList.slice(0, pageSize));
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const mode = useSelector(state => state.mode.mode)
    const dispatch = useDispatch()
    const searchTherm = useSelector(state => state.search.searchTherm)


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
    useEffect(() => {
        if(window.matchMedia("(max-width: 320px)").matches){
            setIsMobile(true);
        } else {
            setRegLimit(myRegions.length);

        }
    },[]);

    useEffect(() => {
        makeRegions()
    }, [myRegions])


    let makeRegions = () => {

            if(myRegions && myRegions.length>0){
                let items = [];
                for(let i=0; i + curIdx <myRegions.length && i < regLimit; i++){
                    items.push(
                        <Card status={1} key={i + curIdx} city={myRegions[i + curIdx].regionName}
                              openModalMethod={openModal}
                        />
                    )
                }
                return items;
            }
        };



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
        if(curIdx < myRegions.length - 1){
            setCurIdx(++curIdx);
        }
        if(curIdx === myRegions.length - 2){
            setDisabledRight(true);
        }
        setDisabledLeft(false);

    };
    let handleAddRegion = (name) => {
        dispatch(addRegion(name))
        addMethod(name);

    };
    const observer = useRef();
    const lastCityElementRef = useCallback(city => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
                let resCities = regionList.filter(c => c.toLowerCase().startsWith(searchTherm.toLowerCase()));
                const endIdx = pageNumber*pageSize + pageSize;
                if(endIdx > (resCities.length - 1)) {
                    setHasMore(false)
                }
                setCities(c => {
                    return [...new Set([...c, ...resCities.slice(pageNumber*pageSize, endIdx)])]
                });

            }
        });
        if (city) observer.current.observe(city)
    }, [pageNumber, searchTherm, dispatch]);

    const inputHandler = useCallback((value) => {
        dispatch(setSearchTherm(value))

    }, [dispatch]);

    useEffect(
        () => {
            if(searchTherm.length){
                let resCities = regionList.filter(c => c.toLowerCase().startsWith(searchTherm.toLowerCase()));
                setCities(resCities.slice(0, pageSize));
                setPageNumber(0);
                setHasMore(true);
            } else {
                setCities(regionList.slice(0, pageSize));
            }

        },
        [searchTherm]
    );

    return (
        <div className={classes.container}>
            <Modal active={modalActive} setActive={setModalActive} >
                <div className={classes.dialogDel}>
                    <p>Do you want to delete {curRegion} from saved regions?</p>
                    <div className={classes.buttons}>
                        <button data-testid="delete" id="deleteBtn" className={classes.closeBtn} onClick={() => deleteRegion(curRegion)}>Delete region</button>
                        <button data-testid="close-menu" id="closeBtn" className={classes.closeBtn} onClick={closeModal}>Close</button>
                    </div>
                </div>
            </Modal>
            <div className={classes.leftside}>
                <div className={mode==='night'? classes.inputSearchNight : classes.inputSearch}>
                    <div className={classes.searchIcon}></div>
                    <input placeholder="Search city.." onChange={event => inputHandler(event.target.value)} value={searchTherm}/>
                    <div className={classes.remIcon} onClick={() => inputHandler('')}></div>
                </div>
                <div className={classes.listOfSearch}>
                    {cities.map((val, index) => {
                        return (
                                        <div className={mode==='night'? classes.listRowNight : classes.listRow} key={index}>
                                            {(cities.length === index + 1) && <div ref={lastCityElementRef}>{val}</div>}
                                            {(cities.length !== index + 1) && <div>{val}</div>}
                                            <div className={classes.plus} onClick={() => handleAddRegion(val)}><MyButton sizing={{"size":'little'}}></MyButton></div>
                                        </div>
                        )
                    })}
                </div>
            </div>
            <div className={classes.rightside}>
                {(myRegions.length > 2 && isMobile)&& <div className={disabledLeft? classes.leftDisabled : classes.left} onClick={slideLeft}></div>}
                <Card status={0} city={defaultRegion.regionName}/>
                {makeRegions()}
                {myRegions.length === 0 &&  <div className={classes.noRegions}><p>No saved regions yet.</p></div>}
                {(myRegions.length > 2 && isMobile) && <div className={disabledRight? classes.rightDisabled : classes.right} onClick={slideRight}></div>}
            </div>
        </div>
    );
};

export default Search;
