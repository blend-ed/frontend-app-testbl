// import node module libraries
import { Card, Image, Placeholder } from 'react-bootstrap';

// import custom components
import ApexCharts from '../../../../components/elements/charts/ApexCharts';
import useUserDetails from '../../../../hooks/useUserDetails';
import { ProfileDropdown } from '../../../../layouts/common/ProfileDropdown';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const ProfilePlusProgress = ({ overallProgress, loading }) => {

    const { userDetails, userDetailsLoading } = useUserDetails();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    // Initialize state with data from localStorage
    const [userData, setUserData] = useState(() => {
        const savedData = localStorage.getItem('userData');
        return savedData ? JSON.parse(savedData) : { overallProgress: 0 };
    });

    // Save data to localStorage when it's received
    useEffect(() => {
        if (!loading && userDetails && !userDetailsLoading) {
            const savedData = localStorage.getItem('userData');
            const savedDataParsed = savedData ? JSON.parse(savedData) : null;
    
            const newUserData = {
                ...userData,
                overallProgress: overallProgress,
            };
    
            // Only update localStorage and userData state if the data has changed
            if (JSON.stringify(newUserData) !== JSON.stringify(savedDataParsed) && overallProgress !== 0) {
                localStorage.setItem('userData', JSON.stringify(newUserData));
                setUserData(newUserData);
            }
        }
    }, [loading, overallProgress, userDetails, userDetailsLoading]);

    const dashboardData = {
        avatar: userDetails?.profile_image,
        name: userDetails?.name,
    };

    const OverallProgressOptions = {
        chart: {
            type: 'radialBar',
            sparkline: {
                enabled: true
            },
            toolbar: { show: false }
        },
        colors: ['var(--blended-primary)'],
        plotOptions: {
            radialBar: {
                startAngle: -85,
                endAngle: 85,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    position: 'front',
                    dropShadow: {
                        enabled: false,
                        blur: 4,
                        opacity: 0.1
                    }
                },
                track: {
                    strokeWidth: '100%',
                    margin: 0, // margin is in pixels
                    background: 'var(--blended-light-primary)',
                },
                dataLabels: {
                    showOn: 'always',
                    name: {
                        fontWeight: '500',
                        color: '#18113c'
                    },
                    value: {
                        formatter: function (val) {
                            return parseInt(val) + '%';
                        },
                        color: '#18113c',
                        fontSize: '28px', //48
                        fontWeight: '700',
                        show: true,
                        offsetY: isMobile ? 9 : -38,
                    }
                }
            }
        },
        grid: {
            padding: {
                bottom: 24
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Progress']
    };

    return (
        <Card className="mb-5 position-relative">
            <div className='position-absolute top-0 end-0 mt-2 me-3'>
                <ProfileDropdown dashboard>
                    <span className='fe fe-more-horizontal fs-4 mt-1' />
                </ProfileDropdown>
            </div>
            <Card.Body className='mb-md-n4 d-flex d-md-block align-items-center text-center justify-content-center py-3'>
                {dashboardData.avatar ?
                    <Image
                        src={dashboardData.avatar}
                        className="my-1 avatar-xl rounded-circle border border-4 border-gray position-relative"
                        alt=""
                    />
                    :
                    <Placeholder animation="glow">
                        <Placeholder xs={4} className='my-1 avatar-xl rounded-circle border border-4 border-gray bg-gray position-relative' />
                    </Placeholder>
                }
                <h4 className="mb-1">
                    {dashboardData.name ? dashboardData.name
                        :
                        <Placeholder animation="glow">
                            <Placeholder xs={4} className='rounded bg-gray' />
                        </Placeholder>
                    }
                </h4>
                <div className='mb-3'>
                    <ApexCharts
                        options={OverallProgressOptions}
                        series={[userData.overallProgress ? userData.overallProgress : 0]}
                        type="radialBar"
                        height={240}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};
export default ProfilePlusProgress;
