// import node module libraries
import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// import sub components
import { DrawerContext, SubOrgContext } from '../../../context/Context';
import FreeTrialModal from '../../../helper/free-trial/FreeTrialModal';
import SandboxModal from '../../../helper/SandboxModal';
import useFeatures from '../../../hooks/useFeatures';
import EmailVerify from '../../../layouts/EmailVerfiy';
import { Card } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import ChatDrawer from './ChatDrawer';
import NavbarTop from './NavbarTop';
import NavbarVertical from './NavbarVertical';
import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { AppConfigContext } from '../../../context/Context';

const SUB_ORG_PLAN = gql`
    query getSubOrgPlan($sub_org_name: String = "", $domain: String = "") {
        sub_org(where: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}) {
            name
            subscribed_plan
        }
    }
`;

const PROGRAM_COUNT = gql`
    query getSubOrgPlan($sub_org_name: String = "", $domain: String = "") {
        program_aggregate(where: {sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}) {
            aggregate {
                count
            }
        }
    }  
`;

const GET_THEME = gql`
query getTheme($user_id: uuid = "", $domain: String = "") {
  user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}) {
    theme
  }
}`


const DashboardIndex = (props) => {

    const { user } = useAuth0();
    const subOrg = 'localhost'
    const org = window.location.origin.split('.')[1]
    
    const ConfigContext = useContext(AppConfigContext);

    function themeSkinCalc (theme) {
        if(theme !== 'dark') {
            if(org === 'blend-ed' || org === 'localhost' || org === undefined) {
                return 'light'
            } else {
                return org
            }
        }
        return theme
    }

    const { data:themeData }= useQuery(GET_THEME, {
        variables: {
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            domain: window.location.origin
        }
    })

    useEffect(()=>{
       if(themeData !== undefined){
           // save this in the context
        ConfigContext.appStateDispatch({
            type: 'CHANGE_SKIN',
            payload: {
                skin: themeSkinCalc(themeData?.user_details[0]?.theme)
            }
        })
    
        //update in localstorage
        localStorage.setItem('skin', themeSkinCalc(themeData?.user_details[0]?.theme));
        document.querySelector('html').setAttribute('data-theme', themeSkinCalc(themeData?.user_details[0]?.theme));
       }
    },[themeData])

    const { features } = useFeatures();

    const [showMenu, setShowMenu] = useState(true);
    const ToggleMenu = () => {
        return setShowMenu(!showMenu);
    };

    const location = useLocation()

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const [show, setShow] = useState(false);
    const [drawerActive, setDrawerActive] = useState(false);
    const [sandboxModalShow, setSandboxModalShow] = useState(false);
    const [freeTrialModalShow, setFreeTrialModalShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s, setDrawerActive(true));

    const isSandbox = localStorage.getItem('subOrg') === 'sandbox' ? true : false;
    const sandboxFormSubmitted = localStorage.getItem('sandboxFormSubmitted') === 'true' ? true : false;

    useEffect(() => {
        if (isSandbox && !sandboxFormSubmitted) {
            setSandboxModalShow(true);
        }
    }, [isSandbox, sandboxFormSubmitted]);

    const handleCloseSandboxModal = () => setSandboxModalShow(false);

    const { data } = useQuery(SUB_ORG_PLAN, {
        variables: {
            sub_org_name: subOrg,
            domain: window.location.origin
        }
    });

    const { data: programCount } = useQuery(PROGRAM_COUNT, {
        variables: {
            sub_org_name: subOrg,
            domain: window.location.origin
        }
    });

    const isFreeTrial = data?.sub_org[0]?.subscribed_plan === 'Free' ? true : false;
    const freeTrialFormSubmitted = localStorage.getItem('freeTrialFormSubmitted') === 'true' ? true : false;
    const firstLogin = user?.['https://hasura.io/jwt/claims']?.logins_count < 5 ? true : false;

    console.log('isFreeTrial', isFreeTrial, 'freeTrialFormSubmitted', freeTrialFormSubmitted, 'firstLogin', firstLogin, 'programCount', programCount?.program_aggregate?.aggregate?.count);

    useEffect(() => {
        if (isFreeTrial && !freeTrialFormSubmitted && firstLogin && !programCount?.program_aggregate?.aggregate?.count) {
            setFreeTrialModalShow(true);
        }
    }, [isFreeTrial, freeTrialFormSubmitted, firstLogin, programCount]);

    const handleCloseFreeTrialModal = () => {
        setFreeTrialModalShow(false);
        localStorage.setItem('freeTrialFormSubmitted', 'true');
    };

    const CurrentDashboard = window.location.pathname.includes('/a/') ? 'Super Admin'
        : window.location.pathname.includes('/i/') ? 'Instructor'
            : window.location.pathname.includes('/m/') ? 'Mentor'
                : 'Student'

    useEffect(() => {
        sessionStorage.setItem('role', CurrentDashboard.replace(' ', '_').toLowerCase())
    }, [CurrentDashboard])

    return (

        <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
            <div className="navbar-vertical navbar">
                <NavbarVertical
                    showMenu={showMenu}
                    onClick={(value) => setShowMenu(value)}
                />
            </div>
            <div id="page-content">
                <div className="header">
                    {isMobile
                        ?
                        <NavbarTop
                            data={{
                                showMenu: showMenu,
                                SidebarToggleMenu: ToggleMenu
                            }}
                        />
                        :
                        location.pathname !== '/dashboard'
                            ?
                            <NavbarTop
                                data={{
                                    showMenu: showMenu,
                                    SidebarToggleMenu: ToggleMenu
                                }}
                                showChatDrawer={toggleShow}
                            />
                            :
                            ''
                    }
                </div>
                <EmailVerify />
                <div className={`container-fluid p-4`}>
                    <DrawerContext.Provider value={{ toggleShow }}>
                        {props.children}
                        <Outlet />
                    </DrawerContext.Provider>
                </div>
            </div>
            {features?.includes('chat') && <div className='position-relative'>
                <ChatDrawer show={show} onHide={handleClose} drawerActive={drawerActive} setDrawerActive={setDrawerActive} />
                {!show &&
                    <div className='position-fixed bottom-0 end-0 m-4'>
                        <Card className='rounded-circle shadow-lg border border-4 border-light p-3' onClick={toggleShow} style={{ cursor: 'pointer' }}>
                            <span className='fe fe-message-circle fw-bold fs-3' />
                        </Card>
                    </div>}
            </div>}
            <div>
                <SandboxModal sandboxModalShow={sandboxModalShow} handleCloseSandboxModal={handleCloseSandboxModal} />
            </div>
            <div>
                <FreeTrialModal freeTrialModalShow={freeTrialModalShow} handleCloseFreeTrialModal={handleCloseFreeTrialModal} />
            </div>
        </div>
    );
};
export default DashboardIndex;
