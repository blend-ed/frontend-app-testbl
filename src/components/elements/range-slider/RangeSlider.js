// import node module libraries
import React, { Fragment, useState } from "react";
import Nouislider from "nouislider-react";
import PropTypes from 'prop-types';

const RangeSlider = (props) => {    
    const {startValue, endValue, rangeMin, rangeMax} = props;
    const [value, setValue] = useState(startValue)
    const handleUpdate = (value) =>{
        //console.log(value);
        //setValue(10);
        return 10
    }
    return (
        <Fragment>
            <Nouislider 
                range={{ min: rangeMin, max: rangeMax }} 
                start={value} 
                connect
                tooltips={true}
               // onUpdate={handleUpdate}
                />
        </Fragment>
    )
}

// ** PropTypes
RangeSlider.propTypes = {
	startValue: PropTypes.number,
	endValue: PropTypes.number,
    rangeMin: PropTypes.number,
	rangeMax: PropTypes.number
};

// ** Default Props
RangeSlider.defaultProps = {
	startValue: 20,
    endValue: 80,
    rangeMin:0,
    rangeMax:100,
};

export default RangeSlider;