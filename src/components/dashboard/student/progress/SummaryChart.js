// import node module libraries
import useLocalStorage from '../../../../hooks/useLocalStorage';
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

// import custom components
import ApexCharts from '../../../../components/elements/charts/ApexCharts';

import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../context/Context';

const GET_PROGRAM_SUMMARY = gql`
	query getProgramSummary($org_url: String = "", $program_id: uuid = "", $sub_org: String = "", $user_id: uuid = "") {
		courseSummary(org_url: $org_url, program_id: $program_id, sub_org: $sub_org, user_id: $user_id) {
			course_summary
            err_msg
		}
	}
`

const colors = [
    // Add more colors as needed
    "var(--blended-primary)",
    "var(--blended-secondary)",
    "var(--blended-tertiary)",
    "var(--blended-success)",
    "var(--blended-info)",
    "var(--blended-warning)",
    "var(--blended-danger)",
    "var(--blended-dark)",
    "var(--blended-light)",
];

const SummaryChart = ({ selectedProgramId, studentId }) => {

    const { user: student } = useAuth0()
    const { getStorageValue } = useLocalStorage();

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [TaskSectionChartSeries, setTaskSectionChartSeries] = useState([])
    const [chartLabels, setChartLabels] = useState([])

    const { data: programSummaryData, loading, refetch } = useQuery(GET_PROGRAM_SUMMARY, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id: studentId || student?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            program_id: selectedProgramId
        },
        skip: !sub_org_name
    })

    useEffect(() => {
        if (programSummaryData && programSummaryData.courseSummary.course_summary?.length > 0) {
            const chartSeries = programSummaryData.courseSummary.course_summary.map(course => course.completion_percentage)
            const chartLabels = programSummaryData.courseSummary.course_summary.map(course => course.course_name)
            console.log(chartSeries, chartLabels)
            setTaskSectionChartSeries(chartSeries)
            setChartLabels(chartLabels)
        }
    }, [programSummaryData])

    useEffect(() => {
        console.log('summary chart program id changed', selectedProgramId);
        refetch()
    }, [selectedProgramId])

    const programColorCount = chartLabels?.length;

    // Generate random colors
    const programColors = [];

    for (let i = 0; i < programColorCount; i++) {
        programColors.push(colors[i % colors.length]);
    }

    const TaskSectionChartOptions = {
        colors: loading ? ['var(--blended-gray-100)'] : programColors,
        labels: loading ? [''] : chartLabels,
        chart: {
            toolbar: {
                show: false
            },
            height: 350,
        },
        legend: {
            show: true,
            fontSize: '14px',
            fontFamily: 'Inter',
            fontWeight: 400,
            position: 'bottom',
            labels: {
                colors: getStorageValue('skin') === 'light' ? 'var(--blended-gray-500)' : 'var(--blended-gray-700)',
                useSeriesColors: false
            },
            itemMargin: {
                horizontal: 10,
                vertical: 3
            },
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        show: true,
                        offsetY: -10,
                        fontSize: '14px',
                        fontWeight: 600,
                        formatter: function (val) {
                            if (!loading)
                                return val.slice(0, 10) + (val.length > 10 ? '...' : '');
                        }
                    },
                    value: {
                        fontSize: '20px',
                        offsetY: 5,
                        fontWeight: 400,
                        formatter: function (val) {
                            if (!loading)
                                return val + ' %';
                        }
                    },
                    total: {
                        fontSize: '14px',
                        fontWeight: 600,
                        show: loading || chartLabels.length < 2 ? false : true,
                        label: 'Total',
                        formatter: function () {
                            if (!loading)
                            return Math.round(TaskSectionChartSeries.reduce((a, b) => a + b, 0)/chartLabels.length) + ' %';
                        }
                    }
                },
                track: {
                    background: 'var(--blended-gray-100)',
                    margin: chartLabels.length > 3 ? 7 : chartLabels.length > 2 ? 8 : chartLabels.length > 1 ? 9 : 16,
                }
            },
            bar: {
                horizontal: true,
            }
        },
        stroke: {
            lineCap: 'round'
        },
    };

    if(programSummaryData?.courseSummary?.course_summary?.length === 0 || programSummaryData?.courseSummary?.course_summary === null) {
        return (
            <Card className="mb-4">
                <Card.Body className='px-3 px-lg-4'>
                    <div className='text-center'>
                        <h4 className='fs-lg-3'>Program Summary</h4>
                    </div>
                    <div className="mt-4 text-center">
                        <p className='mb-0 fw-medium'> Data not available.</p>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-4">
            <Card.Body className='px-3 px-lg-4'>
                <div className='text-center'>
                    <h4 className='fs-lg-3'>Program Summary</h4>
                </div>
                {/* chart  */}
                {programSummaryData?.courseSummary.course_summary?.length > 0 ?
                    <ApexCharts
                        options={TaskSectionChartOptions}
                        series={TaskSectionChartSeries || [1]}
                        type={'radialBar'}
                        height={400}
                    />
                    : loading ? (
                        <ApexCharts
                            options={TaskSectionChartOptions}
                            series={[0]}
                            type={'radialBar'}
                            height={400}
                        />
                    ) :
                        <div className="mt-4 text-center">
                            <p className='mb-0 fw-medium'>Select a Program</p>
                        </div>
                }
            </Card.Body>
        </Card>
    );
};
export default SummaryChart;
