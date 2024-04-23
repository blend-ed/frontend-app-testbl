// import node module libraries
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react';
import {
    Col,
    InputGroup,
    Pagination,
    Row,
    Spinner,
    Table
} from 'react-bootstrap';
import {
    useFilters,
    useGlobalFilter,
    usePagination,
    useTable
} from 'react-table';

// import data files
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../../../../context/Context';
import { useEffect, useState } from 'react';
import FlatPicker from 'react-flatpickr';
import { useMediaQuery } from 'react-responsive';

const GET_PROGRAMS = gql`
    query getPrograms($org_url: String = "", $sub_org_name: String = "", $user_id: uuid = "") {
        program_enrollment(where: {program: {sub_org:{name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $org_url}}}}, user_id: {_eq: $user_id}}) {
            program_id
            program {
                title
            }
        }
    }
`

const GET_ATTENDANCE = gql`
	query getAttendance($end: String = "", $org_url: String = "", $start: String = "", $sub_org: String = "", $user_id: uuid = "", $program_id: uuid = "") {
		attendanceStudents(end: $end, org_url: $org_url, start: $start, sub_org: $sub_org, user_id: $user_id, program_id: $program_id) {
			attendance
            err_msg
		}
	}	  
`;

const AttendanceTable = ({ mentor, studentId, programId }) => {

    const { user } = useAuth0()

    const isMobile = useMediaQuery({ maxWidth: 767 })

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [attendanceArray, setAttendanceArray] = useState([])

    const originalDate = new Date();

    const today = originalDate;

    // Create a new Date object for yesterday
    const yesterday = new Date(originalDate);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format today and yesterday
    const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const formattedYesterday = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

    const [startDate, setStartDate] = useState(formattedYesterday)
    const [endDate, setEndDate] = useState(formattedToday)

    const [getAttendance, { data: attendanceData, loading }] = useLazyQuery(GET_ATTENDANCE, {
        onError: (error) => {
            console.error('Mutation error:', error);
        },
    });

    const { data: programsData } = useQuery(GET_PROGRAMS, {
        onError: (error) => {
            console.error('Mutation error:', error);
        },
        variables: {
            org_url: window.location.origin,
            sub_org_name: sub_org_name,
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
        }
    });

    useEffect(() => {
        if (startDate && endDate) {
            getAttendance({
                variables: {
                    org_url: window.location.origin,
                    program_id: programId,
                    start: startDate,
                    end: endDate,
                    sub_org: sub_org_name,
                    user_id: mentor ? studentId : user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                },
            });
        }
        // console.log("attendance data :",attendanceData);

    }, [startDate, endDate, programId, programsData]);

    useEffect(() => {
        console.log('attendance data:', attendanceData);
        if (attendanceData && attendanceData.attendanceStudents && Object.keys(attendanceData.attendanceStudents.attendance).length > 0 ) {
            setAttendanceArray(attendanceData.attendanceStudents.attendance);
        } else {
            setAttendanceArray([]);
        }
    }, [attendanceData])

    useEffect(()=>{
        console.log('attendance array:', attendanceArray);
    },[attendanceArray])

    const data = useMemo(() => {

        // Extract dates and courses from attendance data
        const dates = Object.keys(attendanceArray) // Sort in descending order
        const courses = dates.length > 0 ? Object.keys(attendanceArray[dates[0]]) : [];

        // Transform data into rows
        const rows = courses.map((course) => {
            const rowData = { 'Course Name': course };
            dates.forEach((date) => {
                rowData[date] = attendanceArray[date][course].length > 0 ? attendanceArray[date][course][0] : '';
            });
            return rowData;
        });

        // console.log('rows:',rows)
        // console.log('attendance array:', attendanceArray)

        return rows;
    }, [attendanceArray]);

    const columns = useMemo(() => {
        // Generate columns dynamically based on dates
        const dates = Object.keys(attendanceArray) // Sort in descending order
        const dateColumns = dates.map((date) => ({
            accessor: date,
            Header: date,
            Cell: ({ value }) => {
                return (
                    <div>
                        {value ?
                            <span className='fe fe-check fs-3 fw-bold text-success' /> :
                            <span className='fe fe-minus fs-3 fw-bold text-gray' />
                        }
                    </div>
                )
            }
        }));

        return [
            {
                accessor: 'Course Name',
                Header: 'Course Name',
            },
            ...dateColumns,
        ];
    }, [attendanceArray]);


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        state,
        gotoPage,
        pageCount,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize: 10,
                hiddenColumns: columns.map((column) => {
                    if (column.show === false) return column.accessor || column.id;
                    else return false;
                })
            }
        },
        useFilters,
        useGlobalFilter,
        usePagination
    );

    const { pageIndex } = state;

    return (
        <div>
            <Row className='justify-content-between align-items-center px-4 py-3'>
                <Col>
                    <h4 className={isMobile ? 'text-center mb-3' : 'fs-3 mb-0'}>Attendance</h4>
                </Col>
                <Col xl={mentor ? 5 : 3}>
                    <InputGroup size={isMobile && 'sm'}>
                        <FlatPicker
                            onChange={e => {
                                const Dates =
                                    e.map(dateString => {
                                        const date = new Date(dateString);
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        return `${year}-${month}-${day}`;
                                    });
                                setStartDate(Dates[0]);
                                setEndDate(Dates[1]);
                            }}
                            placeholder="Select Dates"
                            className="form-control col"
                            options={{
                                mode: "range",
                                maxDate: "today",
                                dateFormat: "d-m-Y",
                                defaultDate: [formattedYesterday, formattedToday]
                            }}
                        />
                        <span className="input-group-text text-muted" id="basic-addon2">
                            <i className="fe fe-calendar"></i>
                        </span>
                    </InputGroup>
                </Col>
            </Row>

            <div className="table-responsive">
                {attendanceArray && attendanceArray.length != 0 ? (
                    <Table {...getTableProps()} className="text-nowrap">
                        <thead className="table-light">
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()} className="">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()} className='align-middle'>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                )
                    :
                    loading ?
                        (<div className='px-4 pt-2 pb-1' style={{ minHeight: '2rem' }}>
                            <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>)
                        : (
                            <div>
                                <p className='px-4 pt-2 pb-1 mb-0 fw-medium'>Attendance Data not available</p>
                            </div>
                        )}
            </div>

            {/* Pagination @ Footer */}
            <Pagination
                previousPage={previousPage}
                pageCount={pageCount}
                pageIndex={pageIndex}
                gotoPage={gotoPage}
                nextPage={nextPage}
            />

        </div>
    );
};

export default AttendanceTable;
