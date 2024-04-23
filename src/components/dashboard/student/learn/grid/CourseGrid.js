// import node module libraries
import { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import StudentCourseCard from './StudentCourseCard';

const CourseGrid = (props) => {

    const { CoursesList, refetch, pageNumber, setIsLoading } = props;

    const programsPerPage = 100;
    const pagesVisited = pageNumber * programsPerPage;

    const displayCourses = CoursesList.slice(
        pagesVisited,
        pagesVisited + programsPerPage
    ).map((item, index) => {
        return (
            <Col xxl={3} xl={4} lg={6} xs={6} className={`mb-4 mb-md-6`} key={index}>
                <StudentCourseCard setIsLoading={setIsLoading} item={item} extraclass='mx-n1 mx-md-0' />
            </Col>
        );
    });

    return (
        <Fragment>
            <Row>
                {displayCourses.length > 0 ? (
                    displayCourses
                ) : (
                    <Col>No matching Courses found.</Col>
                )}
            </Row>
        </Fragment>
    );
};

export default CourseGrid;
