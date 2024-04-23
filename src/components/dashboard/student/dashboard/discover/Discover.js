// import node module libraries
import usePrograms from '../../../../../hooks/usePrograms';
import { Fragment, useEffect, useState } from 'react';
import { Card, Col, Dropdown, Form, InputGroup, Placeholder, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import StudentDiscoverCardNew from './StudentDiscoverCard';

const StudentDiscover = () => {

    const { discoverPrograms: data, discoverProgramsLoading: loading } = usePrograms();

    const isMobile = useMediaQuery({ maxWidth: 767 })

    const [ProgramsList, setProgramsList] = useState([])

    useEffect(() => {
        if (data && data.program) {
            setProgramsList(data.program);
        }
    }, [data])

    // paging start
    const [pageNumber, setPageNumber] = useState(0);
    const programsPerPage = 100;
    const pagesVisited = pageNumber * programsPerPage;

    const [filterValues, setFilterValues] = useState({
        filter: 'default',
        sortBy: 'default'
    });

    const DisplayProgram = ({ item, filterValue }) => {

        const [displayFilter, setDisplayFilter] = useState(true);

        return (
            <Col xxl={3} xl={3} lg={4} xs={6} className={`${!displayFilter && 'd-none'}`}>
                <StudentDiscoverCardNew filter={filterValue} setDisplayFilter={setDisplayFilter} item={item} />
            </Col>
        );
    };

    const displayPrograms = ProgramsList?.slice(
        pagesVisited,
        pagesVisited + programsPerPage
    ).map((item, index) => (
        <DisplayProgram key={index} item={item} filterValue={filterValues.filter} />
    ));

    // searching code started
    const [searchTerm, setSearchTerm] = useState('');

    const getSearchTerm = (event) => {
        let searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        if (searchTerm !== '') {
            const newProgramsList = data.program.filter((program) => {
                return Object.values(program)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            });
            setProgramsList(newProgramsList.slice(0, 500));
            setPageNumber(0);
        } else {
            setProgramsList(data.program.slice(0, 500));
        }
    };

    const convertToMinutes = (Duration) => {
        const [value, unit] = Duration.split(' ');

        switch (unit?.toLowerCase()) {
            case 'minute':
            case 'minutes':
                return value;
            case 'hour':
            case 'hours':
                return value * 60;
            case 'day':
            case 'days':
                return value * 60 * 24;
            case 'week':
            case 'weeks':
                return value * 60 * 24 * 7;
            case 'month':
            case 'months':
                return value * 60 * 24 * 30;
            case 'year':
            case 'years':
                return value * 60 * 24 * 365;
            default:
                return 0;
        }
    };

    // Sorting
    useEffect(() => {
        const sortedData = data?.program?.map(item => ({ ...item }));; // Create a new array using the spread operator

        // bubble sort
        const len = sortedData?.length
        var step = 0, i = 0;


        if (filterValues.sortBy === 'Low to High') {
            for (step = 0; step < len - 1; step++) {
                for (i = 0; i < len - step - 1; i++) {
                    if (Number(sortedData[i].price) > Number(sortedData[i + 1].price)) {
                        const temp = sortedData[i];
                        sortedData[i] = sortedData[i + 1];
                        sortedData[i + 1] = temp;
                    }
                }
            }
        }

        if (filterValues.sortBy === 'High to Low') {
            for (step = 0; step < len - 1; step++) {
                for (i = 0; i < len - step - 1; i++) {
                    if (Number(sortedData[i].price) > Number(sortedData[i + 1].price)) {
                        const temp = sortedData[i];
                        sortedData[i] = sortedData[i + 1];
                        sortedData[i + 1] = temp;
                    }
                }
            }
            sortedData.reverse();
        }

        if (filterValues.sortBy === 'Duration') {
            sortedData.sort((a, b) => convertToMinutes(a.est_time_completion) - convertToMinutes(b.est_time_completion));
        }

        if (filterValues.sortBy === 'Popular') {
            for (step = 0; step < len - 1; step++) {
                for (i = 0; i < len - step - 1; i++) {
                    if (Number(sortedData[i].program_enrollments_aggregate.aggregate.count) > Number(sortedData[i + 1].program_enrollments_aggregate.aggregate.count)) {
                        const temp = sortedData[i];
                        sortedData[i] = sortedData[i + 1];
                        sortedData[i + 1] = temp;
                    }
                }
            }
            sortedData.reverse();
        }

        setProgramsList(sortedData);


        // eslint-disable-next-line 
    }, [filterValues.sortBy, data]);

    function handleChangeFilter(item, value) {
        setFilterValues((prevData) => {
            return ({
                ...prevData,
                [item]: value
            })
        })
    }

    return (
        <Fragment>
            <div className='mx-lg-4 mb-lg-5 mb-4 pt-lg-2 d-flex justify-content-lg-start justify-content-between'>
                <div className='me-lg-4 me-3'>
                    <InputGroup className='border rounded' size={isMobile && 'sm'}>
                        <InputGroup.Text className='border-0'>
                            <span className='fa fa-search ps-lg-2' />
                        </InputGroup.Text>
                        <Form.Control
                            type="search"
                            placeholder={`Search`}
                            value={searchTerm}
                            onChange={getSearchTerm}
                            className='border-0 ps-2'
                        />
                    </InputGroup>
                </div>
                <div className='d-flex align-items-center'>
                    <Dropdown onSelect={(selected) => handleChangeFilter('filter', selected)} className='me-lg-4 me-3 border rounded'>
                        <Dropdown.Toggle variant='white' className={"border d-flex text-gray-500 fw-normal align-items-center " + isMobile && "dropdown-toggle-arrow-hide"} size={isMobile && 'sm'}>
                            <span className="fe fe-filter" />
                            {!isMobile && <span className='ms-2'>{(filterValues.filter) === 'default' ? 'Filter' : filterValues.filter}</span>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="mb-0" eventKey="default">
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.filter === "default"} readOnly={true} />
                                <span className="text-dark">All</span>
                            </Dropdown.Item>
                            <Dropdown.Item className="mb-0" eventKey="Programs">
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.filter === "Programs"} readOnly={true} />
                                <span className="text-dark">Programs</span>
                            </Dropdown.Item>
                            <Dropdown.Item className="mb-0" eventKey="Courses">
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.filter === "Courses"} readOnly={true} />
                                <span className="text-dark">Courses</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown onSelect={(selected) => handleChangeFilter('sortBy', selected)} className='border rounded'>
                        <Dropdown.Toggle variant='white' className={"border d-flex text-gray-500 fw-normal align-items-center " + isMobile && "dropdown-toggle-arrow-hide"} size={isMobile && 'sm'}>
                            <div className='d-flex'>
                                <div>
                                    <div className="fe fe-chevron-up mb-n1" />
                                    <div className="fe fe-chevron-down" />
                                </div>
                                {!isMobile && <span className='ms-2'>{(filterValues.sortBy) === 'default' ? 'Sort by' : filterValues.sortBy}</span>}
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="mb-0" eventKey='Duration'>
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.sortBy === "Duration"} readOnly={true} />
                                <span className="text-dark">Duration</span>
                            </Dropdown.Item>
                            <Dropdown.Item className="mb-0" eventKey="Popular">
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.sortBy === "Popular"} readOnly={true} />
                                <span className="text-dark">Most Popular</span>
                            </Dropdown.Item>
                            <Dropdown.Item className="mb-0" eventKey='Low to High'>
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.sortBy === "Low to High"} readOnly={true} />
                                <span className="text-dark">Price low to high</span>
                            </Dropdown.Item>
                            <Dropdown.Item className="mb-0" eventKey='High to Low'>
                                <Form.Check type="radio" className="me-2 mt-1" size="lg" checked={filterValues.sortBy === "High to Low"} readOnly={true} />
                                <span className="text-dark">Price high to low</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <Row className='mx-lg-2 g-lg-4 g-3'>
                {loading ?
                    Array.from({ length: 4 }).map((_, index) => (
                        <Col xxl={3} xl={3} lg={4} xs={6}>
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
                                <Card.Body className={`px-3 px-lg-4 py-2 py-lg-3 pt-lg-0`}>
                                    <h3
                                        className={`fw-semibold text-inherit text-truncate-line-2 fs-lg-3 text-gray`}
                                        style={{
                                            height: !isMobile ? "3.2em" : "2.8em",
                                            fontSize: isMobile && '1em'
                                        }}
                                    >
                                        <Placeholder xs={12} className="rounded" />
                                    </h3>
                                    <div>
                                        <div className='mb-lg-2 mb-1 text-gray d-flex'>
                                            {!isMobile &&
                                                <Placeholder xs={6} className="rounded" />
                                            }
                                            <div style={{ fontSize: (isMobile && '.7em') }}>
                                                <Placeholder xs={6} className="rounded" />
                                            </div>
                                        </div>
                                        <p className={`mb-0 fw-semi-bold text-truncate-line fs-lg-4`}>
                                            <Placeholder xs={3} className="rounded" />
                                        </p>
                                    </div>
                                </Card.Body>
                            </Placeholder>
                        </Col>
                    ))
                    :
                    displayPrograms?.length > 0 ? (
                        displayPrograms
                    ) : (
                        <Col>No matching programs found.</Col>
                    )
                }
            </Row>
        </Fragment>
    );
};

export default StudentDiscover;
