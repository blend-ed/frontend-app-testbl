// import node module libraries
import { useAuth0 } from '@auth0/auth0-react';
import ProgramCover from '../../../../../assets/images/background/program-cover-img.png';
import { SubOrgContext } from '../../../../../context/Context';
import usePrograms from '../../../../../hooks/usePrograms';
import PropTypes from 'prop-types';
import { Fragment, useContext, useEffect } from 'react';
import {
    Badge,
    Card,
    Image
} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

const StudentDiscoverCard = ({ item, extraclass, filter, setDisplayFilter, slider }) => {

    const isMobile = useMediaQuery({ maxWidth: 767 })

    const ConfigContext = useContext(SubOrgContext)
    const org = ConfigContext?.subOrgState?.subOrg?.replace(/[^a-z0-9]/gi, '').toLowerCase()

    const { user } = useAuth0();
    const sub_org_plans = user?.["https://hasura.io/jwt/claims"]["sub_org_plans"]

    var ORG = org;
    if (sub_org_plans['localhost'] == 'Free') {
        ORG = window.location.origin === 'http://localhost:3000' ? 'localhost' : 'blended'
    }

    const { programDetails: ProgramCourse } = usePrograms(item.id)

    const ProgramType = ProgramCourse?.program_course?.length === 1 ?
        'Courses'
        : (ProgramCourse?.program_course?.length > 1 || ProgramCourse?.program_course?.length === 0) &&
        'Programs'

    useEffect(() => {
        if (!slider) {
            filter === 'Programs' && ProgramType === 'Courses' ? setDisplayFilter(false) :
                filter === 'Courses' && ProgramType === 'Programs' ? setDisplayFilter(false) : setDisplayFilter(true)
        }
    }, [filter])


    /** Used in Course Index, Course Category, Course Filter Page, Student Dashboard etc...  */
    const GridView = () => {
        return (
            <Card
                as={Link}
                to={`/discover/single/${item.id}`}
                className={`card-hover shadow-sm card-bordered w-100 ${extraclass} ${ProgramType === 'Programs' && 'bg-dark'}`}
            >
                <div className="m-lg-3 m-2">
                    <Image
                        src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/programCardImages/${ORG}/${item.program_card_image}` || ProgramCover}
                        alt="Program Card Image"
                        className="card-img-top rounded"
                        style={{
                            width: '100%',
                            height: !isMobile ? '10rem' : '5rem',
                            objectFit: 'cover',
                            overflow: 'hidden'
                        }}
                        onError={(e) => {
                            e.target.src = ProgramCover; // Set default image if there is an error
                        }}
                    />
                </div>
                <Card.Body className={`px-3 px-lg-4 py-2 py-lg-3 pt-lg-0`}>
                    <h3
                        className={`fw-semibold text-inherit text-truncate-line-2 fs-lg-3 ${ProgramType === 'Programs' && 'text-white'}`}
                        style={{
                            height: !isMobile ? "3.2em" : "2.8em",
                            fontSize: isMobile && '1em'
                        }}
                    >
                        {item.title}
                    </h3>
                    <div>
                        <div className='mb-lg-2 mb-1 text-gray-500 d-flex'>
                            {!isMobile && item.category && <div className={ProgramType === 'Programs' ? 'text-white' : 'text-dark'} style={{ fontSize: (isMobile && '.7em') }}>
                                <Badge pill className='fw-normal'>
                                    {item.category.length > 15 ? item.category.substring(0, 15) + '...' : item.category}
                                </Badge>
                                <span className='mx-2'>|</span>
                            </div>}
                            <div className={ProgramType === 'Programs' ? 'text-white' : 'text-dark'} style={{ fontSize: (isMobile && '.7em') }}>
                                {item.est_time_completion}
                            </div>
                        </div>
                        <p className={`mb-0 ${ProgramType === 'Programs' ? 'text-white' : 'text-primary'} fw-semi-bold text-truncate-line fs-lg-4`}>
                            {item.price > 0 ?
                                <>
                                    <span>{localStorage.getItem('currency')} {Number(item.price) - Number(item.discount)}</span>
                                    {item.discount &&
                                        <strike className='ms-2 text-muted fs-lg-5'>{localStorage.getItem('currency')} {Number(item.price)}</strike>
                                    }
                                </>
                                :
                                'Free'
                            }
                        </p>
                    </div>
                </Card.Body>
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
StudentDiscoverCard.defaultProps = {
    free: false,
    viewby: 'grid',
    showprogressbar: false,
    extraclass: ''
};

// Typechecking With PropTypes
StudentDiscoverCard.propTypes = {
    item: PropTypes.object.isRequired,
    free: PropTypes.bool,
    viewby: PropTypes.string,
    showprogressbar: PropTypes.bool,
    extraclass: PropTypes.string
};

export default StudentDiscoverCard;
