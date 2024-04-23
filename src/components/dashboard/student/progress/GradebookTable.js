// import node module libraries
import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import {
    Card,
    Col,
    Row,
    Table
} from 'react-bootstrap';
import Select from 'react-select';
import {
    useFilters,
    useGlobalFilter,
    usePagination,
    useTable
} from 'react-table';


// import utility file
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../context/Context';

const GET_STUDENT_GRADEBOOK = gql`
    query studentGradebook($org_url: String = "", $user_id: uuid = "", $sub_org: String = "") {
        newGradeBook(org_url: $org_url, sub_org: $sub_org, user_id: $user_id) {
            gradebook
            err_msg
        }
    }
`

const GET_COURSE_DETAILS = gql`
    query getCourseDetails($course_openedx_id: [String!] = "") {
        course(where: {openedx_id: {_in: $course_openedx_id}}) {
            name
            openedx_id
        }
    }
`

const GradebookTable = ({ selectedProgramId, isMobile }) => {

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sectionBreakdown, setSectionBreakdown] = useState([]);

    const [courses, setCourses] = useState([]);

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const { user: student } = useAuth0();

    const {data: studentGradebookData, loading: gradebookLoading, refetch: gradebookRefetch} = useQuery(GET_STUDENT_GRADEBOOK, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id: student?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]
        },
        skip: !sub_org_name
    })

    const [getCourseDetails, { data: courseDetailsData, loading: courseDetailsLoading }] = useLazyQuery(GET_COURSE_DETAILS)

    useEffect(() => {
        if (studentGradebookData) {
            const gradebook = studentGradebookData?.newGradeBook?.gradebook?.[selectedProgramId];
            if (gradebook && typeof gradebook === 'object') {
                const courseIds = Object.keys(gradebook);
                getCourseDetails({
                    variables: {
                        course_openedx_id: courseIds
                    }
                });
            }
        }
    }, [studentGradebookData, selectedProgramId])

    useEffect(() => {
        if (selectedCourse) {
            const gradebook = studentGradebookData?.newGradeBook?.gradebook?.[selectedProgramId];
            const courseDetails = gradebook && gradebook?.[selectedCourse.value];
            if (courseDetails) {
                setSectionBreakdown(courseDetails.section_breakdown);
            } else {
                setSectionBreakdown([]);
            }
        }
    }, [selectedCourse, studentGradebookData, selectedProgramId]);

    // select a first course as default once the course details are fetched
    useEffect(() => {
        if (courseDetailsData && courseDetailsData.course.length > 0) {
            setSelectedCourse({
                value: courseDetailsData.course[0].openedx_id,
                label: courseDetailsData.course[0].name
            });
        }
    }, [courseDetailsData]);    

    const getCourseOptions = () => {
        if (courseDetailsData) {
            return courseDetailsData.course?.map(course => ({
                value: course.openedx_id,
                label: course.name
            }));
        }
        return [];
    };

    // render a react table to display gradebook section_breakdown details, also it should contain the a dropdown to select the course
    const columns = useMemo(() => [
        {
            Header: 'Category',
            accessor: 'category',
           
        },
        {
            Header: 'Score',
            accessor: 'score',
           
        },
        {
            Header: 'Percentage',
            accessor: 'percentage',
          
        },
        {
            Header: 'Weightage',
            accessor: 'weightage',
          
        },
        {
            Header: 'Weighted Percentage',
            accessor: 'weighted_percent',
            
        }
    ], [courseDetailsData, studentGradebookData, sectionBreakdown, selectedProgramId])


    const [totalWeightedPercentage,setTotalWeightedPercentage] = useState(0)

    const data = useMemo(() => {
        const gradebook = studentGradebookData?.newGradeBook?.gradebook?.[selectedProgramId];
        if (courseDetailsData && gradebook?.[selectedCourse?.value]?.section_breakdown && selectedCourse) {
            const selectedCourseGradeBook = gradebook?.[selectedCourse?.value]?.section_breakdown;
            setTotalWeightedPercentage(gradebook?.[selectedCourse?.value]?.percent * 100);

            if (selectedCourse) {
                const courseDetails = selectedCourseGradeBook?.map(gradeBookObj => {
                    const percentage = (gradeBookObj.percent * 100).toFixed(0);
                    const weightage = (gradeBookObj.weightage.weight * 100).toFixed(2);
                    const weighted_percent = ((percentage * weightage) / 100).toFixed(0);
                    return {
                        category: [gradeBookObj.subsection_name],
                        score: gradeBookObj.score_possible > 0 ? [`${gradeBookObj.score_earned} / ${gradeBookObj.score_possible}`] : ['-'],
                        percentage: [`${percentage} %`],
                        weightage: [weightage],
                        weighted_percent: [`${weighted_percent} %`]
                    };
                });
                return courseDetails;
            }
        }
        return [];
    }, [courseDetailsData, studentGradebookData, sectionBreakdown, selectedProgramId]);

    // updates the value of selectedCrouse to "empty string" if there is no course for a selected program
    useEffect(() => {
        console.log('selectedProgramId:', selectedProgramId);
        if(studentGradebookData?.newGradeBook?.gradebook){
            const programsWithCourses = Object.keys(studentGradebookData?.newGradeBook?.gradebook);
            if(!programsWithCourses.includes(selectedProgramId)){
                setSelectedCourse("");
            }        
        }
    }, [selectedProgramId,studentGradebookData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter
    } = useTable(
        {
            columns,
            data
        },
        useFilters,
        useGlobalFilter,
        usePagination
    )

    const { globalFilter } = state

    return (
        <Fragment>
            <Row>
                <Col lg={12} md={12} sm={12} >
                    <Card className="mb-4">
                        <Card.Header>
                                <Row className="justify-content-md-between align-items-center">
                                    <Col className="">
                                        <h3 className={isMobile ? 'text-center' : 'mb-0'}>
                                            Gradebook Summary
                                        </h3>
                                    </Col>

                                    <Col md={'auto'} xs={12} className='d-flex align-items-center'>
                                        <Select
                                            value={selectedCourse}
                                            onChange={(selectedOption) => {
                                                setSelectedCourse(selectedOption);
                                            }}
                                            options={getCourseOptions(courses)}
                                            placeholder="Select a course"
                                        />
                                    </Col>
                                </Row>
                        </Card.Header>
                        <Card.Body className='p-0'>
                            {
                                selectedCourse != null ? 
                                (sectionBreakdown?.length > 0 ? (
                                    <Table {...getTableProps()} responsive striped hover>
                                        <thead>
                                            {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getTableBodyProps()}>
                                            {page.map(row => {
                                                prepareRow(row)
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map(cell => {
                                                            return (
                                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td><strong>Total</strong></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td><strong>{totalWeightedPercentage + " %"}</strong> </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className='p-4'>No grade data to show.</p>
                                )): (   
                                    <p className='p-4'>Select a Course to see the Grade data.</p>
                                )
                            }
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )



};

export default GradebookTable;
