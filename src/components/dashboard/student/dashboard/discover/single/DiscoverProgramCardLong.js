// import node module libraries
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Row
} from 'react-bootstrap';

const DiscoverProgramCardLong = ({ item }) => {

    const [briefFull, setBriefFull] = useState(false)

    const GridView = () => {
        return (
            <Card className='discover-lg'>
                <Row className='g-0'>
                    <Col xs={'auto'}>
                        <Button
                            onClick={() => history.back()}
                            size='sm'
                            variant='light'
                            className="fe fe-chevron-left fs-3 fw-bold px-2"
                            style={{ borderRadius: '7px 0px 7px 0px' }}
                        />
                    </Col>
                    <Col md={8} className='pe-8'>
                        <Card.Body className='my-n2 my-md-0 mx-n2 mx-md-0'>
                            <Row>
                                <Col md={12} className='text-md-start text-center'>
                                    <div>
                                        <h1 className="fw-bold align-middle text-truncate-line-2 title-lg">
                                            {item?.program?.[0]?.title}
                                        </h1>
                                        <p className={`fs-lg-4 fw-normal ${!briefFull && 'text-truncate-line-3'}`} onClick={() => setBriefFull(!briefFull)}>
                                            {item?.program?.[0].program_brief}
                                        </p>
                                    </div>
                                    <div className='mb-2'>
                                        <Badge pill className='fw-normal px-3 py-2 fs-5'>
                                            {item?.program?.[0]?.category}
                                        </Badge>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        );
    };

    return (
        <Fragment>
            <GridView />
        </Fragment>
    );
};

// Specifies the default values for props
DiscoverProgramCardLong.defaultProps = {
    free: false,
    viewby: 'grid',
    showprogressbar: false,
    extraclass: ''
};

// Typechecking With PropTypes
DiscoverProgramCardLong.propTypes = {
    item: PropTypes.object.isRequired,
    free: PropTypes.bool,
    viewby: PropTypes.string,
    showprogressbar: PropTypes.bool,
    extraclass: PropTypes.string
};

export default DiscoverProgramCardLong;
