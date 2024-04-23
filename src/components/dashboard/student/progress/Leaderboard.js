// import necessary dependencies
import { gql, useQuery } from '@apollo/client';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import {
    Card,
    Col,
    Form,
    Image,
    Placeholder,
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

import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../context/Context';
import Avatar from '../../../../assets/images/avatar/avatar.png';
import Select from 'react-select';
import usePrograms from '../../../../hooks/usePrograms';

// Define your GraphQL query
const GET_LEADERBOARD = gql`
    query getLeaderboard($org_url: String = "", $sub_org_name: String = "", $user_name: String = "") {
        leaderboard(org_url: $org_url, sub_org_name: $sub_org_name, user_name: $user_name) {
            program_id
            leaderboard {
                position
                name
                points
                avatar
            }
            err_msg
        }
    }
`;

const Leaderboard = ({ id }) => {

    const ConfigContext = useContext(SubOrgContext);
    const sub_org_name = 'localhost'

    const {
        enrolledPrograms: programsData, 
    } = usePrograms();

    const [leaderboardData, setLeaderboardData] = useState([]);

    const { user } = useAuth0();

    const [programId, setProgramId] = useState(id ? id : null);

    useEffect(() => {
        if (id) {
            setProgramId(id);
        }
    }, [id]);

    // Fetch leaderboard data based on org_url and program_id using Apollo Client
    const { loading: leaderboardLoading, data: leaderboardQueryData } = useQuery(GET_LEADERBOARD, {
        variables: {
            org_url: window.location.origin,
            sub_org_name: sub_org_name,
            user_name: user?.["https://hasura.io/jwt/claims"]["name"]
        }
    });

    function findLeaderboardByProgramId(leaderboard, programId) {
        for (const item of leaderboard) {
            if (item.program_id === programId) {
                return item.leaderboard;
            }
        }
        return []; // Return null if no match is found
    }

    useEffect(() => {
        if (programId !== null && leaderboardQueryData && leaderboardQueryData.leaderboard) {
            setLeaderboardData(findLeaderboardByProgramId(leaderboardQueryData.leaderboard, programId));
        }
    }, [leaderboardQueryData, programId]);

    useEffect(() => {
        if (programsData?.program_enrollment.length > 0) {
            setProgramId(programsData.program_enrollment[0].program.id);
        }
    }, [programsData]);

    const columns = useMemo(
        () => [
            {
                accessor: 'name',
                Header: 'Name',
                Cell: ({ value, row }) => {
                    return (
                        <div className="d-flex align-items-center my-n1">
                            <h5 className="mb-0 me-2">
                                {row.original.position}
                            </h5>
                            <Image
                                src={row.original.avatar !== "false" ? row.original.avatar : Avatar}
                                alt=""
                                className="rounded-circle avatar-md border border-4 border-gray me-2"
                                onError={(e) => {
                                    e.target.src = Avatar;
                                }}
                            />
                            <h5 className="mb-0">
                                {value.split(' ')[0].split('@')[0]}
                            </h5>
                        </div>
                    );
                }
            },
            {
                accessor: 'points',
                Header: 'Points',
                Cell: ({ value }) => {
                    return (
                        <span className='fs-5 text-dark fw-bold'>
                            {Math.round(value * 100)}
                        </span>
                    )
                }
            },
        ],
        []
    );

    const data = useMemo(() => leaderboardData.slice(1), [leaderboardData, programId]);

    const {
        getTableProps,
        getTableBodyProps,
        page,
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

    const programOptions = programsData?.program_enrollment.map((program) => {
        return {
            value: program.program.id,
            label: program.program.title
        }
    });

    return (
        <Fragment>
            <div>
                <Row className="justify-content-md-between align-items-center mb-3">
                    <Col className="d-flex align-items-center justify-content-between">
                        <h4 className={`mb-0 me-4 text-center text-md-start`}>
                            Leaderboard
                        </h4>
                        {!id && programsData?.program_enrollment.length > 1 && 
                            <Select 
                                options={programOptions}
                                value={programOptions?.find(option => option.value === programId)}
                                onChange={(selectedOption) => setProgramId(selectedOption.value)}
                                size='sm' 
                                className='w-auto'
                            />
                        }
                    </Col>
                </Row>
                <Card>
                    <Card.Body className="px-lg-4 pb-0 px-0">
                        {leaderboardData.length > 0 && <div className='text-center'>
                            <div className='position-relative mb-1'>
                                <Image
                                    src={leaderboardData?.[0]?.avatar !== "false" ? leaderboardData?.[0]?.avatar : Avatar}
                                    alt="Avatar"
                                    className="rounded-circle avatar-lg border border-4 border-gray mb-2"
                                    onError={(e) => {
                                        e.target.src = Avatar;
                                    }}
                                />
                                <div className='fw-medium position-absolute d-flex align-items-center justify-content-center bottom-0 start-50 translate-middle-x bg-dark-primary text-white rounded-circle fs-6' style={{ height: '1.3rem', width: '1.3rem' }}>
                                    1
                                </div>
                            </div>
                            <h5 className='mb-0'>{leaderboardData?.[0]?.name}</h5>
                            <h5 className='text-dark-primary'>{Math.round(leaderboardData?.[0]?.points * 100)} Points</h5>
                        </div>}
                        <div className="border-0 overflow-y-hidden mx-lg-4">
                            <Table {...getTableProps()} className="text-wrap rounded overflow-hidden mb-2" hover>
                                {programId !== null && leaderboardData.length > 0 ? (
                                    <tbody {...getTableBodyProps()}>
                                        {page.map((row) => {
                                            prepareRow(row);
                                            return (
                                                <tr {...row.getRowProps()} className={row.original.name === user?.["https://hasura.io/jwt/claims"]["name"] && 'bg-light-tertiary'}>
                                                    {row.cells.map((cell) => {
                                                        return (
                                                            <td
                                                                {...cell.getCellProps()}
                                                                className="align-middle text-wrap"
                                                            >
                                                                {cell.render('Cell')}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                ) : leaderboardLoading ? (
                                    <div className='pb-3'>
                                        <Placeholder animation="glow" className="d-flex justify-content-center mb-3">
                                            <Placeholder xs={12} bg="gray" className="avatar-lg rounded-circle" />
                                        </Placeholder>
                                        <Placeholder as={Row} animation="glow">
                                            <Col xs={12} className="py-1">
                                                <Placeholder xs={12} bg="gray" className="rounded" />
                                            </Col>
                                            <Col xs={12} className="py-1">
                                                <Placeholder xs={12} bg="gray" className="rounded" />
                                            </Col>
                                            <Col xs={12} className="py-1">
                                                <Placeholder xs={12} bg="gray" className="rounded" />
                                            </Col>
                                            <Col xs={12} className="py-1">
                                                <Placeholder xs={12} bg="gray" className="rounded" />
                                            </Col>
                                        </Placeholder>
                                    </div>
                                ) : (programId === '') ? (
                                    <div>
                                        <p className='px-4 pt-md-4 pt-2 pb-1 mb-0 fw-medium text-center text-md-start'>Select a Program</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h5 className='text-primary pt-1 pb-1 mb-3 text-wrap text-center'>
                                            No data available for the selected program.
                                        </h5>
                                    </div>
                                )}
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Fragment>
    );
};

export default Leaderboard;
