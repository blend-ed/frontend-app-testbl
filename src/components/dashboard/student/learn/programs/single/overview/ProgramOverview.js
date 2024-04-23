import { useAuth0 } from '@auth0/auth0-react';
import Leaderboard from '../../../../../../../components/dashboard/student/progress/Leaderboard';
import { Loading } from '../../../../../../../helper/Loading';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import CommonHeaderTabs from '../CommonHeaderTabs';
import ProgramCourses from './ProgramCourses';
import ProgramProgress from './ProgramProgress';

const ProgramOverview = () => {

    const { id } = useParams();

    const { user: student } = useAuth0()

    const [isLoading, setIsLoading] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 767 })

    const [programGradePercentage, setProgramGradePercentage] = useState(0)

    useEffect(() => {
        // Simulate an API call or any asynchronous operation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 7000);

        return () => {
            clearTimeout(timer); // Clean up the timer if the component unmounts before the loading is complete
        };
    }, [isLoading]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            {!isMobile && <CommonHeaderTabs id={id} />}
            <Row>
                <Col lg={8}>
                    <ProgramCourses id={id} setProgramGradePercentage={setProgramGradePercentage} setIsLoading={setIsLoading} />
                </Col>
                <Col lg={4}>
                    {isMobile && <h4 className='mb-3'>Progress</h4>}
                    <ProgramProgress id={id} user={student} programGradePercentage={programGradePercentage} />
                    <Leaderboard id={id} />
                </Col>
            </Row>
        </div>
    );
};

export default ProgramOverview;