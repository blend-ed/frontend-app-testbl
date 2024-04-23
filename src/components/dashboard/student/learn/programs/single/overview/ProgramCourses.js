import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';
import { Col, Form, Row, Spinner } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import StudentCourseCard from '../../../grid/StudentCourseCard';

const GET_COURSES = gql`
query getCourses($_eq: uuid) {
    course(where: { programs: { program_id: { _eq: $_eq } } }) {
        id
        name
        openedx_id
        course_image
    }
} 
`;

const GET_PROGRESS = gql`
    query getCourseProgress($org_url: String = "", $username: String = "", $program_id: uuid = "") {
        courseProgress(org_url: $org_url, program_id: $program_id, username: $username) {
            course_progress
            program_progress
            err_msg
        }
    }
`;

const ProgramCourses = ({ id, setProgramGradePercentage, setIsLoading }) => {

    const { user } = useAuth0();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const { loading, error, data } = useQuery(GET_COURSES, {
        variables: { _eq: id, org_url: window.location.origin }
    });

    const { data: courseProgressData } = useQuery(GET_PROGRESS, {
        variables: {
            org_url: window.location.origin,
            program_id: id,
            username: user?.["https://hasura.io/jwt/claims"]["openedx_username"]
        }
    });

    useEffect(() => {
        if (courseProgressData?.courseProgress?.program_progress) {
            setProgramGradePercentage(courseProgressData?.courseProgress?.program_progress);
        }
    }, [courseProgressData]);

    const [CourseList, setCourseList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getSearchTerm = (event) => {
        let searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        if (searchTerm !== '') {
            const newCourseList = data.course.filter((course) => {
                return Object.values(course)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            });
            setCourseList(newCourseList.slice(0, 500));
            // setPageNumber(0);
        } else {
            setCourseList(data.course.slice(0, 500));
        }
    };

    useEffect(() => {
        if (data) {
            setCourseList(data.course);
        }
    }, [data]);

    if (loading) {
        return (
            <div className='text-center'>
                <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div>{error || programError}</div>;
    }

    return (
        <div>
            <div className='mb-4 d-flex align-items-center'>
                <div className='lead text-nowrap me-4'>{CourseList?.length} Courses</div>
                <div>
                    <Form.Control
                        type="search"
                        size={isMobile && 'sm'}
                        placeholder="Search"
                        value={searchTerm}
                        onChange={getSearchTerm}
                        className='w-lg-auto'
                    />
                </div>
            </div>
            <Row className='g-lg-4 gx-3 gy-4 mb-4'>
                {CourseList.length > 0 ? (
                    CourseList.map((item, index) => (
                        <Col lg={4} xs={6} key={index}>
                            <StudentCourseCard item={item} setIsLoading={setIsLoading} progress={courseProgressData?.courseProgress.course_progress?.[item.openedx_id]} extraclass="h-100" showprogressbar />
                        </Col>
                    ))
                ) : (
                    <Col className='ms-2'>No matching courses found.</Col>
                )}
            </Row>
        </div>
    );
};

export default ProgramCourses;