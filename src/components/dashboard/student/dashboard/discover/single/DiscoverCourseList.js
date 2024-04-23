import { gql, useQuery } from "@apollo/client";
import { Accordion, Card, Container, Spinner } from "react-bootstrap"
import { useMediaQuery } from "react-responsive";

const GET_PROGRAM_COURSE_OUTLINES = gql`
    query getProgramCourseOutlines($org_url: String = "", $program_id: uuid = "") {
        getCourseOutline(org_url: $org_url, program_id: $program_id) {
            outline
            err_msg
        }
    }
`;

export const DiscoverCourseList = ({ program_id }) => {

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const { loading, data: programCourseOutline } = useQuery(GET_PROGRAM_COURSE_OUTLINES, {
        variables: {
            org_url: window.location.origin,
            program_id: program_id
        }
    });
    
    return (
        <Card.Body className={isMobile ? 'mb-5' : ''}>
            <h3 className='mb-3'>
                Courses
            </h3>
            {loading ? (
                 <Container className="border p-3 mb-3 text-center rounded align-item-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Container>
            ) : (
                <Accordion defaultActiveKey="0" className="rounded">
                    {programCourseOutline?.getCourseOutline.outline?.map((course, courseIndex) => (
                        <Accordion.Item eventKey={courseIndex} key={course.course_key}>
                            <Accordion.Header>
                                <h3 className="mb-0">{course.title}</h3>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Accordion defaultActiveKey="0" className="rounded">
                                    {course.outline.sections.length > 0 ? course.outline.sections.map((section, sectionIndex) => (
                                        <Accordion.Item eventKey={sectionIndex} key={section.id}>
                                            <Accordion.Header>
                                                <h4 className="mb-0">
                                                    {section.title}
                                                </h4>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <ul className="mb-0 text-dark fs-4 my-n2">
                                                    {section.sequence_ids
                                                        .map(id => course.outline.sequences[id])
                                                        .map((sequence, sequenceIndex) => (
                                                            <p key={sequenceIndex} className="my-3 fs-5">{sequence.title}</p>
                                                        ))}
                                                </ul>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )) : <p className="text-center my-2 ">No sections available</p>}
                                </Accordion>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </Card.Body>
    )
}