import React, {useContext, useEffect, useState, useCallback, useRef} from 'react';
import classes from './search-component.module.css';
import Modal from "../header-component/modal";
import RegionService from "../region-service";
import MyButton from "../MyButton";
import {regionList} from './search-storage'
import SearchTermContext from "../search-term-context";
import Card from "../card-component/card";

const pageSize = 10;
const Search = ({regions, deleteMethod, addMethod}) => {

    let [curIdx, setCurIdx] = useState(0);
    let [disabledLeft, setDisabledLeft] = useState(true);
    let [disabledRight, setDisabledRight] = useState(false);
    let [regLimit, setRegLimit] = useState(2);
    let [isOpen, setIsOpen] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    let [curRegion, setCurRegion] = useState('');
    let [myRegions, setMyRegions] = useState(regions);
    let [isMobile, setIsMobile] = useState(false);
    let [cities, setCities] = useState(regionList.slice(0, pageSize));
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const {searchTerm, setSearchTerm} = useContext(SearchTermContext);


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
            setRegLimit(regions.length);

        }
    },[]);

    let makeRegions = () => {

            if(myRegions && myRegions.length>0){
                let items = [];
                for(let i=0; i + curIdx <myRegions.length && i < regLimit; i++){
                    items.push(
                        <Card key={i + curIdx} city={myRegions[i + curIdx].regionName}
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
        if(curIdx < regions.length - 1){
            setCurIdx(++curIdx);
            console.log('step right', curIdx)
        }
        if(curIdx === regions.length - 2){
            setDisabledRight(true);
            console.log('last step right', curIdx)
        }
        setDisabledLeft(false);

    };
    let addRegion = (name) => {
        console.log('adding', name);
        addMethod(name);

    };
    const observer = useRef();
    const lastCityElementRef = useCallback(city => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
                console.log('bottom', pageNumber);
                let resCities = regionList.filter(c => c.toLowerCase().startsWith(searchTerm.toLowerCase()));
                const endIdx = pageNumber*pageSize + pageSize;
                if(endIdx > (resCities.length - 1)) {
                    console.log('no more', endIdx, resCities.length-1)
                    setHasMore(false)
                };
                setCities(c => {
                    return [...new Set([...c, ...resCities.slice(pageNumber*pageSize, endIdx)])]
                });

            }
        });
        if (city) observer.current.observe(city)
    }, [pageNumber, searchTerm]);

    const inputHandler = useCallback((value) => {
        setSearchTerm(value);

    }, []);

    useEffect(
        () => {
            if(searchTerm.length){
                console.log('search term is not empty')
                let resCities = regionList.filter(c => c.toLowerCase().startsWith(searchTerm.toLowerCase()));
                setCities(resCities.slice(0, pageSize));
                setPageNumber(0);
                setHasMore(true);
            }

        },
        [searchTerm]
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
                <div className={classes.inputSearch}>
                    <div className={classes.searchIcon}></div>
                    <input placeholder="Search region.." onChange={event => inputHandler(event.target.value)} value={searchTerm}/>
                </div>
                <div className={classes.listOfSearch}>
                    {cities.map((val, index) => {
                        return (
                                        <div className={classes.listRow} key={index}>
                                            {(cities.length === index + 1) && <div ref={lastCityElementRef}>{val}</div>}
                                            {(cities.length !== index + 1) && <div>{val}</div>}
                                            <div className={classes.plus} onClick={() => addRegion(val)}><MyButton sizing={{"size":'little'}}></MyButton></div>
                                        </div>
                        )
                    })}
                </div>
            </div>
            <div className={classes.rightside}>
                {(myRegions.length > 2 && isMobile)&& <div className={disabledLeft? classes.leftDisabled : classes.left} onClick={slideLeft}></div>}
                {makeRegions()}
                {myRegions.length === 0 &&  <div className={classes.noRegions}><p>No saved regions yet.</p></div>}
                {(myRegions.length > 2 && isMobile) && <div className={disabledRight? classes.rightDisabled : classes.right} onClick={slideRight}></div>}
            </div>
        </div>
    );
};

export default Search;
