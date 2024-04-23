// import node module libraries
import { Button, Card, Spinner } from 'react-bootstrap';

// import custom components
import ApexCharts from '../../../../components/elements/charts/ApexCharts';

import { gql, useMutation, useQuery } from '@apollo/client';
import { SubOrgContext } from '../../../../context/Context';
import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useAuth0 } from '@auth0/auth0-react';

const SET_GOAL = gql`
    mutation setGoal($_eq: uuid = "", $goal: numeric = "", $sub_org: String = "") {
        update_organisation_user(where: {user_id: {_eq: $_eq}, role: {_eq: student}, sub_org: {name: {_eq: $sub_org}}}, _set: {goal: $goal}) {
            affected_rows
        }
    }  
`;

const GET_GOAL = gql`
    query getGoal($_eq: uuid = "", $_eq1: String = "") {
        organisation_user(where: {role: {_eq: student}, user_id: {_eq: $_eq}, sub_org: {name: {_eq: $_eq1}}}) {
            goal
        }
    }
`;


const GET_ENGAGEMENT_DATA = gql`
	query getDailyEnagagment($org_url: String = "", $sub_org: String = "", $user_id: uuid = "") {
		dailyEngagment(org_url: $org_url, sub_org: $sub_org, user_id: $user_id) {
			dailyengagement
            err_msg
		}
	}
`;

const WeeklyEngageChart = ({ studentId, mentor }) => {

    const { user } = useAuth0()

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const isMobile = useMediaQuery({ maxWidth: 767 })
    const [WeeklyEngageData, setWeeklyEngageData] = useState([0, 0, 0, 0, 0, 0, 0])

    const { loading: loadingEngagementData, data: engagementData } = useQuery(GET_ENGAGEMENT_DATA, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id: (studentId ? studentId : user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"])
        },
        skip: !sub_org_name
    })

    useEffect(() => {
        if (engagementData && engagementData.dailyEngagment) {
            setWeeklyEngageData(engagementData.dailyEngagment.dailyengagement)
        }
    }, [engagementData])

    const { data: goalData, refetch } = useQuery(GET_GOAL, {
        variables: {
            _eq: (studentId ? studentId : user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]),
            _eq1: sub_org_name
        },
        skip: !sub_org_name
    })

    const [setGoal, { loading: setGoalLoading }] = useMutation(SET_GOAL);

    const [goal, setGoalState] = useState(0);
    const [showGoalInput, setShowGoalInput] = useState(false);

    useEffect(() => {
        if (goalData?.organisation_user[0]?.goal) {
            setGoalState(goalData?.organisation_user[0]?.goal)
        }
    }, [goalData])

    function formatDay(relativeDays) {
        const today = new Date();
        today.setDate(today.getDate() + relativeDays);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        return dayNames[today.getDay()];
    }

    const WeeklyGoalChartOptions = {
        height: '300',
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '30%',
                borderRadius: 5
            }
        },
        labels: isMobile ? [
            formatDay(-2), // Two days before today
            formatDay(-1), // One day before today
            'Today', // Today
            formatDay(1),  // One day after today
            formatDay(2),  // Two days after today
        ] :
            [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thur',
                'Fri',
                'Sat'
            ],
        chart: {
            fontFamily: '$font-family-base',
            height: '250px',
            type: 'line',
            toolbar: { show: !1 }
        },
        colors: ['var(--blended-tertiary)'],
        stroke: { width: [0, 4], curve: 'smooth' },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            tickAmount: 4,
        },
        yaxis: {
            labels: {
                style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' },
                offsetX: -15,
                // formatter: function (val) {
                //     return val + ' units';
                // }
            },
            min: 0,
            max: WeeklyEngageData?.reduce((a, b) => Math.max(a, b) > 10 ? Math.max(a, b) : goal > 10 ? goal : 10),
            tickAmount: isMobile ? 4 : 5
        },
        grid: {
            borderColor: '#e0e6ed',
            strokeDashArray: 5,
            xaxis: { lines: { show: !1 } },
            yaxis: { lines: { show: !0 } },
        },
        tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
        annotations: {
            yaxis: [
                {
                    y: goal,
                    borderColor: 'var(--blended-primary)',

                    label: {
                        borderColor: 'var(--blended-primary)',
                        style: {
                            color: '#fff',
                            background: 'var(--blended-primary)',
                            fontWeight: 600,
                        },
                        text: 'Goal: ' + goal + ' units'
                    }
                }
            ]
        }
    };

    function formatDataForChart(data) {
        const todayIndex = new Date().getDay(); // Get the index for today (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

        // Create a new array for the chart data with the desired format
        const formattedData = [
            data[(todayIndex + 6) % 7], // Two days before today
            data[(todayIndex + 5) % 7], // One day before today
            data[todayIndex], // Today
            data[(todayIndex + 1) % 7], // One day after today
            data[(todayIndex + 2) % 7], // Two days after today
        ];

        return formattedData;
    }

    const WeeklyGoalChartSeries = [
        {
            name: 'Achieved',
            type: 'column',
            data: isMobile ? formatDataForChart(WeeklyEngageData) : WeeklyEngageData
        }
    ]

    const handleGoalSubmit = () => {
        setGoal({
            variables: {
                _eq: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                goal: goal,
                sub_org: sub_org_name
            },
            onCompleted: () => {
                refetch();
                setShowGoalInput(false);
            }
        })
    }


    return (
        <Card className="mb-4">
            <Card.Body className='mb-n4'>
                <div className='d-flex justify-content-between mx-1 mb-3'>
                    {!(isMobile && showGoalInput) && <h4 className='mb-0 fs-lg-3'>Weekly Engagement</h4>}
                    {!mentor && (showGoalInput ?
                        <div className='d-flex align-items-center'>
                            <div className='me-2'>
                                <Button variant='white' size='sm' className='d-flex align-items-center text-muted' onClick={() => { setShowGoalInput(false); setGoalState(goalData?.organisation_user[0]?.goal) }}>
                                    <span className='fe fe-x me-1' />
                                    {!isMobile && 'Cancel'}
                                </Button>
                            </div>
                            <input
                                type='text'
                                value={goal}
                                onChange={e => setGoalState(e.target.value.replace(/[^0-9]/g, ''))}
                                className='form-control form-control-sm me-2'
                                style={{ width: '100px' }}
                                pattern="\d*"
                                inputMode="numeric"
                                placeholder="units"
                            />
                            <Button variant='primary' size='sm' className='d-lg-flex align-items-center' onClick={handleGoalSubmit}>
                                {!isMobile && <span className='me-1'>Set Goal</span>}
                                {setGoalLoading ?
                                    <Spinner animation="border" size="sm" variant="light" role="status" />
                                    :
                                    <span className='fe fe-check' />
                                }
                            </Button>
                        </div>
                        :
                        <Button variant='primary' size='xs' className='d-flex align-items-center' onClick={() => setShowGoalInput(true)}>
                            <span className='fe fe-crosshair' />
                            {!isMobile && <span className='ms-1'>Set Daily Goal</span>}
                        </Button>)}
                </div>
                    <ApexCharts
                        options={WeeklyGoalChartOptions}
                        series={WeeklyGoalChartSeries}	// data goes here
                        type="line"
                        height={isMobile ? 200 : 300}
                    />
            </Card.Body>
        </Card>
    );
};

export default WeeklyEngageChart;
