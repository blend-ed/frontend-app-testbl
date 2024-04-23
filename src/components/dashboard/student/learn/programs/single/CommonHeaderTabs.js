// import node module libraries
import { Fragment } from 'react';
import { Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import usePrograms from '../../../../../../hooks/usePrograms';
import { SingleProgram } from '../../../../../../routes/dashboard/StudentSingleProgram';
import ProgramCardLong from './StudentProgramCardLong';

const CommonHeaderTabs = (id) => {

    const { programDetails: programData, programDetailsLoading: programLoading } = usePrograms(id.id);

    if (programLoading) {
        return (
            <div className='text-center'>
                <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Row>
            <Col lg={12}>
                <ProgramCardLong item={programData} extraclass="" showprogressbar />
            </Col>
            <Col xs={12} className="mb-4 mt-2">
                <ListGroup as="ul" bsPrefix="nav nav-lb-tab">
                    {SingleProgram.filter(function (dataSource) {
                        return dataSource.title === 'Programs';
                    }).map((menuItem, index) => {
                        return (
                            <Fragment key={index}>
                                {menuItem.children.map(
                                    (subMenuItem, subMenuItemIndex) => {
                                        return (
                                            <ListGroup.Item
                                                key={subMenuItemIndex}
                                                as="li"
                                                bsPrefix="nav-item"
                                                className={`${subMenuItemIndex === 0 ? 'ms-0 me-3' : ''
                                                    } mx-3`}
                                            >
                                                <Link
                                                    to={`${subMenuItem.link}/${id.id}`}
                                                    className={`nav-link mb-sm-3 mb-md-0 ${location.pathname === `${subMenuItem.link}/${id.id}`
                                                        ? 'active'
                                                        : ''
                                                        }`}
                                                >
                                                    {subMenuItem.name}
                                                </Link>
                                            </ListGroup.Item>
                                        );
                                    }
                                )}
                            </Fragment>
                        );
                    })}
                </ListGroup>
            </Col>
        </Row>
    );
};

export default CommonHeaderTabs;
