import { useTable } from 'react-table';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export const NotificationHistory = (props) => {
    const { notificationsLoading, notificationsError, notificationsData, notificationLogsRefetch, deleteNotification } = props;

    const data = useMemo(() => notificationsData?.notifications || [], [notificationsData]);
    const columns = useMemo(() => [
        {
            Header: '#',
            accessor: (row, i) => i + 1,
        },
        {
            Header: 'Date & Time',
            accessor: 'timestamp',
            Cell: ({ value, row }) => (
                <div>
                    {new Date(value).toLocaleString('en-IN')} 
                </div>
            ),
        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: ({ value }) => (
                <div className='text-wrap' dangerouslySetInnerHTML={{ __html: value }} />
            ),
        },
        {
            Header: 'Content',
            accessor: 'body',
            Cell: ({ value }) => (
                <div className='text-wrap' dangerouslySetInnerHTML={{ __html: value }} />
            ),
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => (
                <div>
                    <div className={`mb-1 badge ${new Date(row.original.scheduled_time) < new Date() ? 'bg-success' : 'bg-warning'}`}>
                        {new Date(row.original.scheduled_time) < new Date() ? 'Sent' : 'Scheduled'}
                    </div>
                    {new Date(row.original.scheduled_time) > new Date() && <div className='fs-6 text-muted'>
                        <i className="fe fe-clock"></i> {new Date(row.original.scheduled_time).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {new Date(row.original.scheduled_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
                    </div>}
                </div>
            ),
        },
        {
            Header: 'Actions',
            accessor: 'id',
            Cell: ({ row }) => (
                <Link to='#' onClick={() => deleteNotification({ variables: { notification_id: row.original.id } })}>
                    <i className="fe fe-trash text-danger"></i>
                </Link>
            ),
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <Card>
            <Card.Header className='d-flex justify-content-between'>
                <Card.Title as="h3" className='mb-0'>Notification History</Card.Title>
                <Link to="#" onClick={() => notificationLogsRefetch()}>
                    <i className="fe fe-refresh-cw"></i>
                </Link>
            </Card.Header>
            <Card.Body className='p-0'>
                {notificationsLoading && <p>Loading...</p>}
                {notificationsError && <p>Error: {notificationsError.message}</p>}
                <Table hover {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} className='fw-medium text-muted'>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className='text-nowrap align-middle'>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className='fw-medium text-dark'>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};