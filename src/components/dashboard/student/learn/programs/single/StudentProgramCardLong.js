// import node module libraries
import PropTypes from 'prop-types';
import { Fragment, useContext, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Image,
    Row
} from 'react-bootstrap';

// import utility file
import { useAuth0 } from '@auth0/auth0-react';
import ProgramCover from '../../../../../../assets/images/background/program-cover-img.jpg';
import { SubOrgContext } from "../../../../../../context/Context";
import { Link } from 'react-router-dom';

const ProgramCardLong = ({ item, extraclass }) => {

    /** Used in Program Index, Program Category, Program Filter Page, Student Dashboard etc...  */
    const GridView = () => {

        const ConfigContext = useContext(SubOrgContext)
        const org = 'localhost'?.replace(/[^a-z0-9]/gi, '').toLowerCase()
        const { user } = useAuth0();
        const sub_org_plans = user?.["https://hasura.io/jwt/claims"]["sub_org_plans"]

        var ORG = org;
        if (sub_org_plans['localhost'] == 'Free') {
            ORG = window.location.origin === 'http://localhost:3000' ? 'localhost' : 'blended'
        }

        const [briefFull, setBriefFull] = useState(false)

        return (
            <Card className={` ${extraclass}`}>
                <Row className='g-0'>
                    <Col xs={'auto'}>
                        <Button
                            as={Link}
                            to={`/learn#programs`}
                            size='sm'
                            variant='light'
                            className="fe fe-chevron-left fs-3 fw-bold px-2"
                            style={{ borderRadius: '7px 0px 7px 0px' }}
                        />
                    </Col>

                    {/* Card body  */}
                    <Col md={8} className='pe-8'>
                        <Card.Body className='my-n2 my-md-0 mx-n2 mx-md-0 d-flex flex-column h-100'>
                            <div>
                                <h1 className="fw-bold align-middle text-truncate-line-2 title-lg">
                                    {item?.program[0]?.title}
                                </h1>
                                <p className={`fs-lg-4 fw-normal ${!briefFull && 'text-truncate-line-3'}`} onClick={() => setBriefFull(!briefFull)}>
                                    {item?.program[0].program_brief}
                                </p>
                            </div>
                            <div className='mb-2 mt-auto'>
                                <Badge pill className='fw-normal px-3 py-2 fs-5'>
                                    {item?.program[0]?.category}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Col>
                    <Col className='p-3'>
                        <Image
                            className="rounded"
                            src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/programCardImages/${ORG}/${item?.program[0].program_card_image}`}
                            alt="Program Card Image"
                            style={{
                                height: '12rem',
                                width: '100%',
                                objectFit: 'cover',
                                overflow: 'hidden'
                            }}
                            onError={(e) => {
                                e.target.src = ProgramCover;
                            }}
                        />
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
ProgramCardLong.defaultProps = {
    free: false,
    viewby: 'grid',
    showprogressbar: false,
    extraclass: ''
};

// Typechecking With PropTypes
ProgramCardLong.propTypes = {
    item: PropTypes.object.isRequired,
    free: PropTypes.bool,
    viewby: PropTypes.string,
    showprogressbar: PropTypes.bool,
    extraclass: PropTypes.string
};

export default ProgramCardLong;
