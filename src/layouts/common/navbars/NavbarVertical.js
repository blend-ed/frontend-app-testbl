// import node module libraries
import { Fragment, useContext } from 'react';
import {
    Accordion,
    AccordionContext,
    Badge,
    Card,
    Image,
    ListGroup,
    useAccordionButton
} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { Link, useLocation } from 'react-router-dom';

// import simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import routes file
import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import PoweredBy from '../../../assets/images/brand/poweredbyblended.png';
import { SubOrgContext } from '../../../context/Context';
import useFeatures from '../../../hooks/useFeatures';
import { AdminDashboardMenu } from '../../../routes/dashboard/AdminDashboard';
import { InstructorDashboardMenu } from '../../../routes/dashboard/InstructorDashboard';
import { MentorDashboardMenu } from '../../../routes/dashboard/MentorDashboard';
import { StudentDashboardMenu } from '../../../routes/dashboard/StudentDashboard';

const SUBS_PLAN = gql`
    query subsPlan($user_id: uuid = "", $domain: String = "", $sub_org: String = "") {
        sub_org(where: {sub_organisation_users: {user_id: {_eq: $user_id}}, organisation: {domain: {_eq: $domain}}, name: {_eq: $sub_org}}) {
            name
            sub_org_subscription_plan {
                programs
                plan
                number_of_student
                courses
            }
        }
    }
`

const NavbarVertical = (props) => {

    const ConfigContext = useContext(SubOrgContext);
    const org = 'localhost'?.replace(/[^a-z0-9]/gi, '').toLowerCase()
    const sub_org_name = 'localhost'

    const location = useLocation();

    const { user } = useAuth0()

    const oldVideoLibraryAccess = ['https://dashboard.edutalim.com', 'https://dashboard.blend-ed.com', 'https://demo.blend-ed.com', 'http://localhost:3000'].includes(window.location.origin);

    const InstructorDashboardMenuShow = oldVideoLibraryAccess ? InstructorDashboardMenu : InstructorDashboardMenu.filter((item => !(item.title === 'Video Catalog')))

    const DashboardMenu = window.location.pathname.includes('/a/') ? AdminDashboardMenu
        : window.location.pathname.includes('/i/') ? InstructorDashboardMenuShow
            : window.location.pathname.includes('/m/') ? MentorDashboardMenu
                : StudentDashboardMenu

    const { data: subsPlan } = useQuery(SUBS_PLAN, {
        variables: {
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            domain: window.location.origin,
            sub_org: sub_org_name
        }
    })

    const toggleFeatures = ['chat', 'videolibrary', 'sendnotifications', 'marketing'];
    const { features } = useFeatures();

    const plan = subsPlan?.sub_org[0]?.sub_org_subscription_plan?.plan;

    const CustomToggle = ({ children, eventKey, icon }) => {
        const { activeEventKey } = useContext(AccordionContext);
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!')
        );
        const isCurrentEventKey = activeEventKey === eventKey;
        return (
            <li className="nav-item">
                <Link
                    className="nav-link "
                    onClick={decoratedOnClick}
                    to="#!"
                    data-bs-toggle="collapse"
                    data-bs-target="#navDashboard"
                    aria-expanded={isCurrentEventKey ? true : false}
                    aria-controls="navDashboard"
                >
                    <i className={`nav-icon fe fe-${icon} me-2`}></i> {children}
                </Link>
            </li>
        );
    };

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const ProfileAndroid = () => {
        console.log("Testing Profile")

        if (window.Android && typeof window.Android.profile == 'function') {
            try {
                window.Android.profile();
            }
            catch (e) {
                console.error(e);
            }
        }

        if (window.webkit) {
            if (typeof window.webkit.messageHandlers.profile === 'function') {
                try {
                    window.webkit.messageHandlers.profile.postMessage(null);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    return (
        <Fragment>
            <SimpleBar style={{ maxHeight: '100vh' }}>
                <div className="nav-scroller">
                    <Link className="navbar-brand" to="/dashboard"
                        onClick={() =>
                            isMobile && props.onClick(!props.showMenu)
                        }>
                        {(org && plan !== 'Free') ?
                            <Image src={`https://blend-ed-public-asset-bak.s3.ap-south-1.amazonaws.com/brand/${org}/logo.png`} className='h-100' width={'80%'} />
                            :
                            <Image src={`https://blend-ed-public-asset-bak.s3.ap-south-1.amazonaws.com/brand/blended/logo.png`} alt="" className='h-100' width={'80%'} />}
                    </Link>
                </div>

                {/* Dashboard Menu */}
                <Accordion
                    defaultActiveKey="0"
                    as="ul"
                    className="navbar-nav flex-column"
                >
                    {DashboardMenu.map(function (menu, index) {
                        if (
                            toggleFeatures.includes(menu.title.toLowerCase().replace(" ", "")) &&
                            !features.includes(menu.title.toLowerCase().replace(" ", ""))
                        ) {
                            return null;
                        }
                        if (menu.grouptitle) {
                            return (
                                <Card bsPrefix="nav-item" key={index} className={menu.mobile === false && 'd-none d-md-flex'}>
                                    {/* group title item */}
                                    <div className="navbar-heading">{menu.title}</div>
                                    {/* end of group title item */}
                                </Card>
                            );
                        } else {
                            if (menu.children) {
                                return (
                                    <Fragment key={index}>
                                        {/* main menu / menu level 1 / root items */}
                                        <CustomToggle eventKey={index} icon={menu.icon}>
                                            {menu.title}
                                            {menu.badge ? (
                                                <Badge
                                                    className="ms-1"
                                                    bg={menu.badgecolor ? menu.badgecolor : 'primary'}
                                                >
                                                    {menu.badge}
                                                </Badge>
                                            ) : (
                                                ''
                                            )}
                                        </CustomToggle>
                                        <Accordion.Collapse
                                            eventKey={index}
                                            as="li"
                                            bsPrefix="nav-item"
                                        >
                                            <ListGroup
                                                as="ul"
                                                className="nav flex-column ps-4"
                                            >
                                                {menu.children.map(function (menuItem, menuItemIndex) {
                                                    return (
                                                        <Link
                                                            key={menuItemIndex}
                                                            to={menuItem.link}
                                                            target={menuItem.link.includes('colab') && '_blank'}
                                                            className={`mb-1 nav-link ${location.pathname.includes(menuItem.link) ? 'active' : ''} d-flex align-items-center`}
                                                        >
                                                            <i className={`nav-icon fe fe-${menuItem.icon} me-2`}></i>{' '}
                                                            {menuItem.title}
                                                            {menuItem.badge ? (
                                                                <Badge
                                                                    className="ms-1"
                                                                    bg={menuItem.badgecolor ? menuItem.badgecolor : 'primary'}
                                                                >
                                                                    {menuItem.badge}
                                                                </Badge>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </Link>
                                                    )
                                                })}
                                            </ListGroup>
                                        </Accordion.Collapse>
                                        {/* end of main menu / menu level 1 / root items */}
                                    </Fragment>
                                );
                            } else {
                                return (
                                    <Card bsPrefix="nav-item" key={index}>
                                        {/* menu item without any childern items like Documentation and Changelog items*/}
                                        <Link
                                            to={menu.link}
                                            target={menu.link.includes('colab') && '_blank'}
                                            className={`
                                                nav-link ${location.pathname.includes(menu.link) || location.pathname.includes(menu.link2) ? 'active' : ''}
												${menu.mobile === false && 'd-none d-md-flex align-items-center'}
                                            `}
                                            onClick={() =>
                                                ((menu.mobile && isMobile) ? ProfileAndroid() : isMobile && props.onClick(!props.showMenu))
                                            }
                                        >
                                            <i className={`nav-icon fe fe-${menu.icon} me-2`}></i>{' '}
                                            {menu.title}
                                            {menu.badge ? (
                                                <Badge
                                                    className="ms-1"
                                                    bg={menu.badgecolor ? menu.badgecolor : 'primary'}
                                                >
                                                    {menu.badge}
                                                </Badge>
                                            ) : (
                                                ''
                                            )}
                                        </Link>
                                        {/* end of menu item without any childern items */}
                                    </Card>
                                );
                            }
                        }
                    })}
                </Accordion>
                <div className='d-md-none mt-12 d-flex'>
                    <Link className="text-gray-400 btn btn-outline-white mx-auto"
                        to='/logout'>
                        <i className="fe fe-power me-1"></i> Sign Out
                    </Link>
                </div>
            </SimpleBar>
            {(plan === 'Lite' || plan === 'Standard' || plan === 'Free') && <div className='d-none d-md-flex align-items-end mx-10 text-inverse-gray' style={{ height: '20vh' }}>
                <Image src={PoweredBy} fluid />
            </div>}
        </Fragment>
    );
};

export default NavbarVertical;
