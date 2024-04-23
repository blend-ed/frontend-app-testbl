// import node module libraries
import StudentDiscoverCardNew from '../../../../components/dashboard/student/dashboard/discover/StudentDiscoverCard';
import usePrograms from '../../../../hooks/usePrograms';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import Slider from 'react-slick';

const StudentProgramSlider = ({ setDisplay }) => {

    const { discoverPrograms: data } = usePrograms()

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const settings = {
        infinite: false,
        slidesToShow: 3,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    initialSlide: 2,
                    arrows: false,
                }
            },
            {

                breakpoint: 540,
                settings: {
                    slidesToShow: 1.55,
                    arrows: false,
                    // infinite: true,
                    swipeToSlide: true,
                }
            },

        ],

    };

    if (data?.program.length === 0) {
        setDisplay(false)
    } else {
        setDisplay(true)
    }

    if (!isMobile) {
        return (
            <Fragment>
                {data?.program.length > 3 ?
                    <Slider {...settings} className="mx-md-0 mx-n4 slick-slider-wrapper z-1">
                        {data.program.map((item, index) => (
                            <div className='pe-3' key={index}>
                                <StudentDiscoverCardNew key={index} item={item} extraclass={`mx-md-2 mb-4`} showprogressbar slider />
                            </div>
                        ))}
                    </Slider>
                    :
                    <Row className='g-4 mx-0'>
                        {data?.program.map((item, index) => (
                            <Col md={6} lg={6} xl={4} className="d-flex mb-4" key={index} >
                                <StudentDiscoverCardNew item={item} showprogressbar slider />
                            </Col>
                        ))}
                    </Row>
                }
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                {data?.program.length > 1 ?
                    <Slider {...settings} className="mx-md-4 mx-n4 slick-slider-wrapper">
                        {data.program.map((item, index) => (
                            <div className='pe-4' key={index}>
                                <StudentDiscoverCardNew item={item} extraclass={`ms-4 mb-4`} showprogressbar slider />
                            </div>
                        ))}
                    </Slider>
                    :
                    <Row className='mx-md-4'>
                        {data?.program.map((item, index) => (
                            <Col xs={8} className="d-flex mb-4" key={index} >
                                <StudentDiscoverCardNew item={item} showprogressbar slider />
                            </Col>
                        ))}
                    </Row>
                }
            </Fragment>
        )
    }
};

// Specifies the default values for props
StudentProgramSlider.defaultProps = {
    recommended: false,
    popular: false,
    trending: false,
    category: null
};

// Typechecking With PropTypes
StudentProgramSlider.propTypes = {
    recommended: PropTypes.bool,
    popular: PropTypes.bool,
    trending: PropTypes.bool,
    category: PropTypes.string
};

export default StudentProgramSlider;
