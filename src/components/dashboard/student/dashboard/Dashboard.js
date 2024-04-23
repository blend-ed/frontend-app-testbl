// import node module libraries
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Nav, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from '@auth0/auth0-react';
import Banner from '../../../../components/dashboard/common/banner/Banner';
import StudentProgramSlider from '../../../../components/dashboard/student/dashboard/StudentProgramSlider';
import { SubOrgContext } from '../../../../context/Context';
import { Loading } from '../../../../helper/Loading';
import Notifications from '../../../../layouts/Notifications';
import { useMediaQuery } from 'react-responsive';
import Leaderboard from '../progress/Leaderboard';
import { LastAccessed } from './LastAccessed';
import ProfilePlusProgress from './ProfilePlusProgress';
import { Streaks } from './Streaks';

const GET_BLOCK_PROGRESS = gql`
	query getblockprogress($org_url: String="", $sub_org: String="", $user_id: uuid="") {
		blockProgress(org_url: $org_url, sub_org: $sub_org, user_id: $user_id) {
			overall_completion_percentage
            err_msg
		}
	}
`

const GET_SUPPORT = gql`
query supportDetails($_eq: String = "") {
    organisation(where: {domain: {_eq: $_eq}}) {
      support_mail
      support_phone
    }
  }
`;

const StudentDashboard = () => {

    document.title = 'Dashboard'

    const { user: student } = useAuth0()
    const [overallProgress, setOverallProgress] = useState(0)

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [display, setDisplay] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [testAndroid, setTestAndroid] = useState(null);
    const [streakCount, setStreakCount] = useState(0)

    const [support, setSupport] = useState({
        support_mail: '',
        support_phone: ''
    })

    const { loading: loadingProgressData, data: blockProgressData } = useQuery(GET_BLOCK_PROGRESS, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id: student?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]
        },
        skip: !sub_org_name
    })
    const { data: supportData } = useQuery(GET_SUPPORT, {
        variables: {
            _eq: window.location.origin
        },
        onError: (error) => {
            console.log(error)
        }
    })

    console.log(supportData)

    useEffect(() => {
        if (supportData && supportData.organisation) {
            setSupport({
                support_mail: supportData.organisation[0]?.support_mail,
                support_phone: supportData.organisation[0]?.support_phone
            })
        }
    }, [supportData])

    useEffect(() => {
        if (blockProgressData && blockProgressData.blockProgress) {
            setOverallProgress(blockProgressData.blockProgress.overall_completion_percentage)
        }
    }, [blockProgressData])

    useEffect(() => {
        // Simulate an API call or any asynchronous operation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 7000);

        return () => {
            clearTimeout(timer); // Clean up the timer if the component unmounts before the loading is complete
        };
    }, [isLoading]);


    if (localStorage.getItem("discover") !== '' && localStorage.getItem("discover") !== null && localStorage.getItem("discover") !== undefined) {
        location.replace(`/discover/single/${localStorage.getItem("discover")}`);
    }

    const isMobile = useMediaQuery({ maxWidth: 767 })

    useEffect(() => {
        window.sendToJS = (data) => setTestAndroid(data)
    }, [])



    if (isLoading) {
        return <Loading />
    }

    if (!isMobile) {
        return (
            <div className='mb-6 mx-2'>
                <Row className='g-5'>
                    <Col lg={8}>
                        <div className='d-flex mb-3 justify-content-between'>
                            <h1 className='fw-bold mb-0'>
                                Hello <span className='text-dark-primary'>{student?.["https://hasura.io/jwt/claims"]["name"]}!</span>
                            </h1>
                            <div className='d-flex align-items-center'>
                                <div>
                                    {(support && support.support_mail?.length > 1) && <Dropdown className='me-4' as={Nav.Item}>
                                        <Dropdown.Toggle as={Nav.Link} className='dropdown-toggle-arrow-hide'>
                                            <Button variant='white' size='sm' className='d-flex align-items-center'>
                                                <span className='me-2 fe fe-help-circle' />
                                                Help
                                            </Button>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='my-2'>
                                            <Dropdown.Header className='fw-semi-bold text-primary'>
                                                Technical Support
                                            </Dropdown.Header>
                                            <Dropdown.ItemText className='text-nowrap d-flex align-items-center'>
                                                <span className='fe fe-phone me-2' />
                                                {support.support_phone}
                                            </Dropdown.ItemText>
                                            <Dropdown.ItemText className='text-nowrap d-flex align-items-center'>
                                                <span className='fe fe-mail me-2' />
                                                <a href='mailto: example@blend-ed.com' className='text-primary'>
                                                    {support.support_mail}
                                                </a>
                                            </Dropdown.ItemText>
                                        </Dropdown.Menu>
                                    </Dropdown>}
                                </div>
                                <Notifications CurrentDashboard={'Student'}/>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <Banner />
                        </div>

                        <div className='d-none d-md-block'>
                            <LastAccessed setIsLoading={setIsLoading} />
                        </div>

                        <Row>
                            <Col xs={12} className={`mb-4 ${display ? '' : 'd-none'}`}>
                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                    <h2>
                                        Popular Programs
                                    </h2>
                                    <Link to='/discover' className='d-md-block d-none text-primary fs-4'>
                                        See all <i className='fe fe-arrow-right fs-5' />
                                    </Link>
                                </div>
                                <StudentProgramSlider setDisplay={setDisplay} />
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4} className=''>
                        <ProfilePlusProgress overallProgress={overallProgress} loading={loadingProgressData} />
                        <Streaks setCount={setStreakCount} />
                        <Leaderboard />
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (
            <div>
                <div className='d-flex mt-md-2 mb-md-5 justify-content-center'>
                    <Banner />
                </div>
                <div>
                    {testAndroid}
                </div>
                <div>
                    <LastAccessed setIsLoading={setIsLoading} />
                </div>
                <Row className='mb-2'>
                    <Col xs={12} className={`${display ? '' : 'd-none'}`}>
                        <div className='mb-3 d-flex justify-content-between align-items-center'>
                            <h4 className="mb-0">
                                Popular Programs
                            </h4>
                            <Link to='/discover' className='text-primary'>
                                See all <i className='fe fe-arrow-right' />
                            </Link>
                        </div>
                    </Col>
                    <Col className=''>
                        <StudentProgramSlider setDisplay={setDisplay} />
                    </Col>
                </Row>
                <Leaderboard />
            </div>
        )
    }
};

export default StudentDashboard;
