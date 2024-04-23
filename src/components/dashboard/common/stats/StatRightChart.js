// import node module libraries
import { Card, Col, Row } from 'react-bootstrap';

// import custom components
import ApexCharts from 'components/elements/charts/ApexCharts';

// import data files
import {
    UserChartOptions,
    VisitorChartOptions,
} from 'data/charts/ChartData';

function ShowChart(chartName, salesData, monthly_enrolments) {

    // Get the date for 30 days ago
    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Create an array for the last 30 days
    let last30Days = Array.from({ length: 30 }, (_, i) => {
        let date = new Date();
        date.setDate(date.getDate() - i);
        return date;
    });

    // Map the last 30 days to the sales data
    let salesDataLast30Days = last30Days.map(date => {
        // Find a transaction for this date
        let transaction = salesData?.transactions.find(transaction =>
            new Date(transaction.created_at).toDateString() === date.toDateString()
        );

        return {
            x: date,
            y: transaction ? transaction.price : 0
        };
    });

    // Generate an array of the last 6 months
    let last6Months = Array.from({ length: 6 }, (_, i) => {
        let date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
    }).reverse();

    // Map the enrolment data
    let enrolmentDataLast6Months = last6Months.map(date => {
        let monthName = date.toLocaleString('default', { month: 'long' });
        let enrolment = monthly_enrolments?.find(enrolment =>
            enrolment[0] === monthName
        );

        return {
            x: monthName,
            y: enrolment ? enrolment[1] : 0
        };
    });

    switch (chartName) {
        case 'SalesChart':
            return (
                <ApexCharts
                    options={UserChartOptions}
                    series={[
                        {
                            name: 'Sales', data: salesDataLast30Days
                        }
                    ]}
                    height={60}
                    type="area"
                />
            );
        case 'StudentsChart':
            return (
                <ApexCharts
                    options={VisitorChartOptions}
                    series={[
                        {
                            name: 'Students', data: enrolmentDataLast6Months
                        }
                    ]}
                    height={60}
                    type="area"
                />
            );
        default:
            return chartName + ' chart is undefiend';
    }
}

const StatRightChart = (props) => {
    const {
        title,
        value,
        summary,
        summaryValue,
        summaryIcon,
        showSummaryIcon,
        classValue,
        chartName,
        salesData,
        monthly_enrolments
    } = props;

    return (
        <Card border="light" className={`${classValue}`}>
            <Card.Body>
                <Row>
                    <Col md={12} lg={12} xl={12} sm={12}>
                        <span className="fw-semi-bold text-uppercase fs-6">{title}</span>
                    </Col>
                    <Col md={6} lg={6} xl={6} sm={6}>
                        <h1 className="fw-bold mt-2 mb-0 h2">{value}</h1>
                        <p
                            className={`text-${summaryIcon === 'up' ? 'success' : 'danger'
                                } fw-semi-bold mb-0`}
                        >
                            {showSummaryIcon && summaryIcon ? (
                                <i className={`fe fe-trending-${summaryIcon} me-1`}></i>
                            ) : (
                                ''
                            )}{' '}
                            {summaryValue} <span className='text-muted fw-normal'>{summary}</span>
                        </p>
                    </Col>
                    <Col
                        md={6}
                        lg={6}
                        xl={6}
                        sm={6}
                        className="d-flex align-items-center"
                    >
                        {ShowChart(chartName, salesData, monthly_enrolments)}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default StatRightChart;
