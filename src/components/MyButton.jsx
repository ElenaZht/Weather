import React from 'react';
import classes from './MyButton.module.css';

const MyButton = (props) => {
    // const size = props['sizing']['size'];
    // console.log(size);
    // console.log('classes' + '.' + size);
    // const style = 'classes' + '.' + size;
    return (
        <button className={classes.myBtn}></button>
        // <button className={classes+'.'+size}></button>
    );
};

export default MyButton;
