// ** Import from react dom
import { Navigate, Route, Routes } from 'react-router-dom';

// ** Import core SCSS styles
import '../assets/scss/theme.scss';

/* ----------------------------------- */
import BlankLayout from '../layouts/common/BlankLayout';
import NotFound from '../layouts/common/NotFound';

/* IMPORTS FOR FRONT SPECIALTY SUBMENU ROUTERS */
import ComingSoon from '../components/dashboard/specialty/ComingSoon';
import Error404 from '../components/dashboard/specialty/Error404';
import MaintenanceMode from '../components/dashboard/specialty/MaintenanceMode';

// ** New Dashboard Common
import Calendar from '../components/dashboard/common/calendar/Calendar';
import ProfileDelete from '../components/dashboard/common/account/DeleteProfile';
import PaymentDetails from '../components/dashboard/common/fee/PaymentDetails';

// ** New Student Dashboard
import ResultsStudent from '../components/dashboard/student/Results';
import DashboardStudent from '../components/dashboard/student/dashboard/Dashboard';
import DiscoverStudent from '../components/dashboard/student/dashboard/discover/Discover';
import ProgramDiscover from '../components/dashboard/student/dashboard/discover/single/ProgramDiscover';
import FeeStudent from '../components/dashboard/student/payment/Payment';
import ProgramsStudent from '../components/dashboard/student/learn/grid/ProgramGrid';
import ProgramStudentAttendance from '../components/dashboard/student/learn/programs/single/attendance/Attendance';
import ProgressStudent from '../components/dashboard/student/progress/Progress';

// ** New Instructor Dashboard
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import Account from '../components/dashboard/common/account/Account';
import VerifyMail from '../components/dashboard/common/verifymail/VerifyMail';
import Chat from '../components/dashboard/student/Chat';
import ProgramDiscoverStripe from '../components/dashboard/student/dashboard/discover/single/ProgramDiscoverStripe';
import Learn from '../components/dashboard/student/learn/Learn';
import ProgramOverview from '../components/dashboard/student/learn/programs/single/overview/ProgramOverview';
import Login from '../helper/Login';
import { Logout } from '../helper/Logout';
import Signup from '../helper/Signup';
import { useContext, useEffect, useState } from 'react';
import { StudentPrivateLayout } from './StudentPrivateLayout';
import ChatLayout from './common/ChatLayout';
import DashboardIndex from './common/navbars/DashboardIndex';
import { useMediaQuery } from 'react-responsive';
import DashboardIndexMobile from './common/mobile/DashboardIndexMobile';
import SendNotifications from '../components/dashboard/common/send-notifications/SendNotifications';
import Notifications from '../components/dashboard/common/view-notifications/Notifications';
import useFeatures from '../hooks/useFeatures';
import FeatureNotEnable from '../components/dashboard/specialty/FeatureNotEnable';
import { Loading } from '../helper/Loading';
import { SubOrgContext } from '../context/Context';
import LoginEmail from '../helper/LoginEmail';

const GET_CURRENCY = gql`
  query getCurrency($domain: String = "") {
    organisation(where: { domain: { _eq: $domain } }) {
      currency
    }
  }
`;

const AllRoutes = () => {
    const { user, isAuthenticated } = useAuth0();
    const { features, featuresLoading } = useFeatures();

    const sub_org_name = 'localhost';
    const [enabledFeatures, setEnabledFeatures] = useState([]);

    useEffect(() => {
        if (features) {
            setEnabledFeatures(features);
        }
    }, [features]);

    useQuery(GET_CURRENCY, {
        variables: {
            domain: window.location.origin,
        },
        onCompleted: (data) => {
            localStorage.setItem(
                'currency',
                getCurrencySymbol(data?.organisation[0]?.currency)
            );
        }
    });

    function getCurrencySymbol(currency) {
        return (0)
            .toLocaleString('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
            .replace(/\d/g, '')
            .trim();
    }

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <Routes>
            {/* Routes with BlankLayout */}
            <Route element={<BlankLayout />}>
                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/:id" element={<LoginEmail />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-mail" element={<VerifyMail />} />
            </Route>

            {/* Routes with NotFound */}
            <Route element={<NotFound />}>
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/404-error" element={<Error404 />} />
                <Route path="/maintenance-mode" element={<MaintenanceMode />} />
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/404-error/" replace />} />

            {/* Routes with ChatLayout */}
            <Route element={<StudentPrivateLayout component={ChatLayout} />}>
                <Route path="/chat" element={enabledFeatures?.includes('chat') ? <Chat /> : <FeatureNotEnable />} />
                <Route path="/chat/:id" element={enabledFeatures?.includes('chat') ? <Chat /> : <FeatureNotEnable />} />
            </Route>

            {/* STUDENT DASHBOARD ROUTERS */}
            <Route
                element={
                    <StudentPrivateLayout
                        component={isMobile ? DashboardIndexMobile : DashboardIndex}
                    />
                }
            >
                <Route path="/dashboard" element={<DashboardStudent />} />
                <Route path="/discover" element={<DiscoverStudent />} />
                <Route path="/progress" element={<ProgressStudent />} />
                <Route path="/results" element={<ResultsStudent />} />

                <Route path="/account" element={<Account />} />

                <Route path="/delete" element={<ProfileDelete />} />
                <Route path="/delete" element={<ProfileDelete />} />

                <Route path="/payment" element={<FeeStudent />} />

                <Route path="/payment-invoice/:id" element={<PaymentDetails />} />

                {/* PROGRAMS ROUTERS */}
                <Route path="/learn" element={<Learn />} />

                <Route path="/calendar" element={<Calendar />} />

                <Route path="/notifications" element={<Notifications />} />
                {/* PROGRAMS ROUTERS */}
                <Route path="/programs" element={<ProgramsStudent />} />

                <Route path="/calendar" element={<Calendar />} />

                <Route path="/notifications" element={<Notifications />} />
            </Route>

            <Route
                element={
                    <StudentPrivateLayout
                        component={isMobile ? DashboardIndexMobile : DashboardIndex}
                    />
                }
            >
                <Route
                    path="/programs/single/overview/:id"
                    element={<ProgramOverview />}
                />
                <Route
                    path="/programs/single/attendance/:id"
                    element={<ProgramStudentAttendance />}
                />
                <Route path="/discover/single/:id" element={<ProgramDiscover />} />
                <Route
                    path="/discover/single/stripe/:id"
                    element={<ProgramDiscoverStripe />}
                />
            </Route>
        </Routes>
    );
};

export default AllRoutes;
