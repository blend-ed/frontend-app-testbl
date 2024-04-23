// import node module libraries
import { Loading } from '../../../../helper/Loading';
import usePrograms from '../../../../hooks/usePrograms';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Form, NavLink, Placeholder, Row, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import CourseGrid from './grid/CourseGrid';
import ProgramGrid from './grid/ProgramGrid';

const Learn = () => {

    const { enrolledPrograms, enrolledProgramsRefetch, enrolledProgramsLoading, enrolledCourses, enrolledCoursesRefetch, enrolledCoursesLoading } = usePrograms();

    const [isLoading, setIsLoading] = useState(false);
    const [activeKey, setActiveKey] = useState(window.location.hash || "#courses");
    const [searchProgram, setSearchProgram] = useState('');
    const [searchCourse, setSearchCourse] = useState('');
    const [ProgramsList, setProgramsList] = useState([]);
    const [CoursesList, setCoursesList] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);

    const isMobile = useMediaQuery({ maxWidth: 767 })
    const [isSearch, setIsSearch] = useState(false);

    const programData = enrolledPrograms?.program_enrollment.map(e => e.program);

    useEffect(() => {
        if (enrolledPrograms && enrolledPrograms.program_enrollment) {
            setProgramsList(enrolledPrograms.program_enrollment.map(e => e.program));
        }
    }, [enrolledPrograms])

    useEffect(() => {
        if (enrolledCourses && enrolledCourses.course) {
            setCoursesList(enrolledCourses.course);
        }
    }, [enrolledCourses])

    useEffect(() => {
        // Simulate an API call or any asynchronous operation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 7000);

        return () => {
            clearTimeout(timer); // Clean up the timer if the component unmounts before the loading is complete
        };
    }, [isLoading]);

    const getSearchProgram = (event) => {
        let searchProgram = event.target.value;
        setSearchProgram(searchProgram);
        if (searchProgram !== '') {
            const newProgramsList = programData?.filter((program) => {
                return Object.values(program)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchProgram.toLowerCase());
            });
            setProgramsList(newProgramsList.slice(0, 500));
            setPageNumber(0);
        } else {
            setProgramsList(programData?.slice(0, 500));
        }
    };

    const getSearchCourse = (event) => {
        let searchCourse = event.target.value;
        setSearchCourse(searchCourse);
        if (searchCourse !== '') {
            const newCoursesList = enrolledCourses?.course.filter((course) => {
                return Object.values(course)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchCourse.toLowerCase());
            });
            setCoursesList(newCoursesList.slice(0, 500));
            setPageNumber(0);
        } else {
            setCoursesList(enrolledCourses?.course.slice(0, 500));
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='mx-lg-4 mb-lg-5 pt-lg-2'>
            <TabContainer activeKey={activeKey}>
                <div className="d-flex align-items-center mb-lg-5 mb-4">
                    {((isMobile && !isSearch) || !isMobile) &&
                        <div className='d-flex justify-content-between align-items-center w-100 w-lg-auto'>
                            <ButtonGroup className="me-4 border border-gray">
                                <Button size={isMobile && 'sm'} onClick={() => setActiveKey("#courses")} as={Link} to={"#courses"} variant={activeKey === "#courses" ? "primary" : "white text-primary"} >Courses</Button>
                                <Button size={isMobile && 'sm'} onClick={() => setActiveKey("#programs")} as={Link} to={"#programs"} variant={activeKey === "#programs" ? "primary" : "white text-primary"} >Programs</Button>
                            </ButtonGroup>
                            {isMobile &&
                                <div onClick={() => setIsSearch(true)} className="text-primary fe fe-search fs-4 text-dark" />
                            }
                        </div>
                    }
                    {((isMobile && isSearch) || !isMobile) &&
                        <div className='d-flex justify-content-between align-items-center w-100 w-lg-25'>
                            <Form.Control
                                type="search"
                                size={isMobile && 'sm'}
                                placeholder={activeKey === "#programs" ? "Search Programs" : "Search Courses"}
                                value={activeKey === "#programs" ? searchProgram : searchCourse}
                                onChange={activeKey === "#programs" ? getSearchProgram : getSearchCourse}
                            />
                            {isMobile &&
                                <NavLink onClick={() => setIsSearch(false)} className="text-primary ms-3 fs-6">Cancel</NavLink>
                            }
                        </div>
                    }
                </div>
                {(enrolledCoursesLoading || enrolledProgramsLoading) ?
                    <Row>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Col xxl={3} xl={3} lg={4} xs={6} key={index}>
                                <Placeholder as={Card} animation='glow' className={`card-hover shadow-sm card-bordered w-100 text-gray`}>
                                    <div className="m-lg-3 m-2">
                                        <Placeholder
                                            className="card-img-top rounded"
                                            style={{
                                                width: '100%',
                                                height: !isMobile ? '10rem' : '5rem',
                                                objectFit: 'cover',
                                                overflow: 'hidden'
                                            }}
                                        />
                                    </div>
                                    <Card.Body className={`px-3 px-lg-4 pt-lg-0`}>
                                        <h3
                                            className={`fw-semibold text-inherit text-truncate-line-2 fs-lg-3 text-gray`}
                                            style={{
                                                height: !isMobile ? "3.2em" : "2.8em",
                                                fontSize: isMobile && '1em'
                                            }}
                                        >
                                            <Placeholder xs={12} className="rounded" />
                                        </h3>
                                        <div style={{ fontSize: '.7em' }} className={`pt-lg-1 pt-md-0 d-flex align-items-center`}>
                                            <Placeholder xs={12} className="rounded" />
                                        </div>
                                    </Card.Body>
                                </Placeholder>
                            </Col>
                        ))}
                    </Row>
                    :
                    <TabContent>
                        <TabPane eventKey="#courses">
                            <CourseGrid
                                CoursesList={CoursesList}
                                refetch={enrolledCoursesRefetch}
                                pageNumber={pageNumber}
                                setIsLoading={setIsLoading}
                            />
                        </TabPane>
                        <TabPane eventKey="#programs">
                            <ProgramGrid
                                ProgramsList={ProgramsList}
                                refetch={enrolledProgramsRefetch}
                                pageNumber={pageNumber}
                                setIsLoading={setIsLoading}
                            />
                        </TabPane>
                    </TabContent>}
            </TabContainer>
        </div>
    );
}

export default Learn;
