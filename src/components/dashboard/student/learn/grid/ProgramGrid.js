// import node module libraries
import { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import StudentProgramCard from './StudentProgramCard';

const ProgramGrid = (props) => {

    const { ProgramsList, refetch, pageNumber, setIsLoading } = props;

    const programsPerPage = 100;
    const pagesVisited = pageNumber * programsPerPage;

    const displayPrograms = ProgramsList.slice(
        pagesVisited,
        pagesVisited + programsPerPage
    ).map((item, index) => {
        return (
            <Col xxl={3} xl={4} lg={6} xs={6} className={`mb-4 mb-md-6`} key={index}>
                <StudentProgramCard setIsLoading={setIsLoading} item={item} refetch={refetch} extraclass='mx-n1 mx-md-0' />
            </Col>
        );
    });

    return (
        <Fragment>
            <Row>
                {displayPrograms.length > 0 ? (
                    displayPrograms
                ) : (
                    <Col>No matching programs found.</Col>
                )}
            </Row>
        </Fragment>
    );
};

export default ProgramGrid;
