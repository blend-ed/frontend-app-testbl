import { useAuth0 } from '@auth0/auth0-react';
import usePrograms from '../../../../hooks/usePrograms';
import { Fragment, useEffect, useState } from 'react';
import { Card, Col, Form, Placeholder, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import WeeklyEngageChart from '../dashboard/WeeklyEngageChart';
import AttendanceTable from '../learn/programs/single/attendance/AttendanceTable';
import GradebookTable from './GradebookTable';
import SummaryChart from './SummaryChart';
import WatchTimeChart from './WatchTimeChart';

const Progress = () => {

    const {
        enrolledPrograms: data,
        enrolledProgramsLoading: loading,
        enrolledCourses: courseData,
        enrolledCoursesLoading: courseLoading,
    } = usePrograms();

    const { user } = useAuth0();
    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);

    useEffect(() => {
        if (data && data.program_enrollment.length > 0) {
            setSelectedProgramId(data?.program_enrollment[0].program.id);
            setSelectedProgram({
                value: data?.program_enrollment[0].program.id,
                label: data?.program_enrollment[0].program.title,
            });
        }
    }, [data]);

    if (loading || courseLoading) {
        return (
            <Placeholder animation='glow' as='div' className='text-gray'>
                <div className="d-md-flex justify-content-center align-items-center mb-4">
                    <h3 className="mb-0 me-4 text-muted d-none d-md-block">
                        Select a Program
                    </h3>
                    <Placeholder xs={2} style={{ height: '2rem' }} className='rounded' />
                </div>
                <Row className="mb-md-0">
                    <Col lg={8} md={12}>
                            <Placeholder xs={12} as={Card} className='rounded mb-4' style={{ height: '20rem' }} />
                            <Placeholder xs={12} as={Card} className='rounded' style={{ height: '20rem' }} />
                    </Col>
                    <Col lg={4} md={12}>
                        <Placeholder xs={12} as={Card} className='rounded mb-4' style={{ height: '24rem' }} />
                        <Placeholder xs={12} as={Card} className='rounded' style={{ height: '24rem' }} />
                    </Col>
                </Row>
            </Placeholder>
        );
    }

    if (data?.program_enrollment.length > 0 && courseData?.course.length > 0) {
        return (
            <Fragment>
                <div className="d-md-flex justify-content-center align-items-center mb-4">
                    <h3 className="mb-0 me-4 text-muted d-none d-md-block">
                        Select a Program
                    </h3>
                    <Form>
                        <Select
                            value={selectedProgram}
                            onChange={(e) => { setSelectedProgramId(e.value); setSelectedProgram({ value: e.value, label: e.label }) }}
                            options={data?.program_enrollment.map((item) => ({
                                label: item.program.title,
                                value: item.program.id,
                            }))}
                        ></Select>
                    </Form>
                </div>
                <Row className="mb-md-0">
                    <Col lg={8} md={12}>
                        <WeeklyEngageChart />
                        <div className="d-md-block d-none">
                            <GradebookTable selectedProgramId={selectedProgramId} />
                        </div>
                        <Card className='mb-lg-0 mb-4'>
                            <AttendanceTable programId={selectedProgramId} />
                        </Card>
                    </Col>
                    <Col lg={4} md={12}>
                        <SummaryChart selectedProgramId={selectedProgramId} />
                        <WatchTimeChart
                            userId={user?.['https://hasura.io/jwt/claims']['x-hasura-user-id']}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    } else {
        return (
            <div className="d-flex align-items-center">
                No programs found.{' '}
                <Link to="/discover" className="ms-3 btn btn-outline-primary">
                    Go to Discover
                </Link>
            </div>
        );
    }
};

export default Progress;
