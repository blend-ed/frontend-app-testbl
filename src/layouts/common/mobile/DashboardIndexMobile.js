// import node module libraries
import { Outlet } from 'react-router-dom';

// import sub components
import EmailVerify from '../../../layouts/EmailVerfiy';
import NavbarBottomMobile from './NavbarBottomMobile';
import NavbarTopMobile from './NavbarTopMobile';

const DashboardIndexMobile = (props) => {

    return (
        <div className={window.location.pathname.includes('/discover/single') && 'bg-white'}>
            <NavbarTopMobile />
            <NavbarBottomMobile />
            <EmailVerify />
            <div className={`p-4 mb-8`}>
                {props.children}
                <Outlet />
            </div>
        </div>
    );
};
export default DashboardIndexMobile;
