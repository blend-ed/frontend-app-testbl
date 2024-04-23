// import node module libraries
import { Card, Spinner } from 'react-bootstrap';

// import custom components
import ApexCharts from '../../../../components/elements/charts/ApexCharts';

import { gql, useQuery } from '@apollo/client';
import { useMediaQuery } from 'react-responsive';

const VIDEO_WATCH = gql`
  query videoWatch($org_url: String = "", $user_id: uuid = "") {
	videoAnalytics(org_url: $org_url, user_id: $user_id) {
	  video_watch
      err_msg
	}
  }
`;

const WatchTimeChart = ({ userId }) => {

    const { data, loading } = useQuery(VIDEO_WATCH, {
        variables: {
            org_url: window.location.origin,
            user_id: userId
        }
    });

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const videoWatchData = data?.videoAnalytics?.video_watch?.[0] ? data?.videoAnalytics?.video_watch?.[0] : [0, 0, 0];

    const VideoWatchTimeSeries = videoWatchData.length > 1 ? [Math.round(videoWatchData[1]), Math.round(videoWatchData[2])] : videoWatchData;

    const VideoWatchOptions = {
        labels: videoWatchData.length > 1 ? ['Today', 'This Month'] : ['No Video Data'],
        colors: ["var(--blended-primary)", "var(--blended-tertiary)"],
        chart: {
            type: 'bar',
            height: isMobile ? 200 : 300,
            toolbar: {
                show: false
            },
        },
        legend: { show: false, position: 'bottom' },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: 40,
                borderRadius: 5,
                distributed: true,
            }
        },
        xaxis: {
            categories: videoWatchData.length > 1 ? ['Today', 'This Month'] : ['No Video Data'],
        },
        yaxis: {
            min: 0,
            max: VideoWatchTimeSeries?.reduce((a, b) => Math.max(a, b) > 60 ? Math.max(a, b) : 60),
            tickAmount: isMobile ? 3 : 5,
        },
        tooltip: {
            theme: 'light', marker: { show: !0 }, x: { show: !0 }, y: {
                formatter: function (val) { return (
                    val > 60 ? Math.floor(val / 60) + 'm ' + (val % 60) + 's' : val + 's'
                ) }, title: {
                    formatter: () => '',
                },
            }
        },
        grid: {
            borderColor: '#e0e6ed',
            strokeDashArray: 5,
            xaxis: { lines: { show: !1 } },
            yaxis: { lines: { show: !0 } },
        },
    };

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Card>
            <Card.Body className='pb-1'>
                <div>
                    <h4 className="text-center fs-lg-3">Video Watched</h4>
                </div>
                {/* chart  */}
                <ApexCharts
                    options={VideoWatchOptions}
                    series={[{ data: VideoWatchTimeSeries }]}
                    type="bar"
                    height={isMobile ? 200 : 300}
                />
            </Card.Body>
        </Card>
    );
};
export default WatchTimeChart;
