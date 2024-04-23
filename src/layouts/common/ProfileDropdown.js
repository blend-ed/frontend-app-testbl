import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { SubOrgContext } from "../../context/Context";
import { useContext } from "react";
import { Dropdown, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const OPENEDX_URLS = gql`
    query getOpenedxEndpoint($_eq: String = "") {
        organisation(where: {domain: {_eq: $_eq}}) {
            openedx_endpoint
        }
    }
`;

const GET_SUB_ORGS = gql`
    query getSubOrgs($domain: String = "", $user_id: uuid = "") {
        organisation_user(where: {user_id: {_eq: $user_id}, sub_org: {organisation: {domain: {_eq: $domain}}}}, distinct_on: sub_org_id) {
            sub_org {
                name
                id
            }
        }
    }
`;

const UPDATE_LAST_ACCESSED_SUBORG = gql`
    mutation updateLastAccessedSuborg($user_id: uuid = "", $domain: String = "", $last_accessed_suborg: uuid = "") {
        update_user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}, _set: {last_accessed_suborg: $last_accessed_suborg}) {
            returning {
                last_accessed_suborg_details {
                    name
                }
            }
        }
    }
`;  

export const ProfileDropdown = ({ children, dashboard }) => {

    const { user } = useAuth0()
    const ConfigContext = useContext(SubOrgContext)
    const subOrg = 'localhost'

    const CurrentDashboard = window.location.pathname.includes('/a/') ? 'Super Admin'
        : window.location.pathname.includes('/i/') ? 'Instructor'
            : window.location.pathname.includes('/m/') ? 'Mentor'
                : 'Student'

    let DashboardList = [
        'Student'
    ]

    if (user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][subOrg]?.includes('super_admin')) {
        DashboardList.push('Super Admin')
    }

    if (user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][subOrg]?.includes('instructor')) {
        DashboardList.push('Instructor')
    }

    if (user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][subOrg]?.includes('mentor')) {
        DashboardList.push('Mentor')
    }

    const { data: orgData } = useQuery(OPENEDX_URLS, {
        variables: { _eq: window.location.origin }
    })

    const { data: subOrgData } = useQuery(GET_SUB_ORGS, {
        variables: {
            domain: window.location.origin,
            user_id: user?.['https://hasura.io/jwt/claims']["x-hasura-user-id"]
        }
    });

    const [updateDefaultSuborg] = useMutation(UPDATE_LAST_ACCESSED_SUBORG);

    const changeSubOrg = (subOrg) => {
        ConfigContext.subOrgStateDispatch({
            type: 'CHANGE_SUBORG',
            payload: {
                subOrg: subOrg
            }
        });
        updateDefaultSuborg({
            variables: {
                user_id: user?.['https://hasura.io/jwt/claims']["x-hasura-user-id"],
                domain: window.location.origin,
                last_accessed_suborg: subOrgData.organisation_user.find(value => value.sub_org.name === subOrg).sub_org.id
            }
        });
    }

    return (
        <Dropdown as={Nav.Item} className='ms-2'>
            <Dropdown.Toggle
                as={Nav.Link}
                className={"d-flex align-items-center" + (dashboard ? ' dropdown-toggle-arrow-hide' : "")}
            >
                {children}
            </Dropdown.Toggle>
            <Dropdown.Menu className="py-0 text-center">
                {DashboardList.length > 1 && <Dropdown.ItemText className="pt-3">
                    <Dropdown as={Nav.Item} drop='start'>
                        <Dropdown.Toggle variant='primary' className='btn-sm ps-2 rounded-4 w-100 align-items-center d-flex justify-content-center'>
                            {CurrentDashboard}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {DashboardList.filter(value => value !== CurrentDashboard).map((item, index) => (
                                <Dropdown.Item key={index} as={Link} to={`/${item !== 'Student' ? item === 'Super Admin' ? 'a/' : item.toLowerCase().charAt(0) + '/' : ''}dashboard`}>
                                    {item}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Dropdown.ItemText>}
                <Dropdown.Item eventKey="2" className='mt-2 ps-2 d-none d-md-block' as={Link} to={`/account`}>
                    <i className="fe fe-user me-2"></i> Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                {user?.['https://hasura.io/jwt/claims'].sub_orgs.length > 1 && <Dropdown.ItemText className="pt-2">
                    <Dropdown as={Nav.Item} drop='start'>
                        <Dropdown.Toggle variant='outline-primary' className='btn-sm ps-2 rounded-4 w-100 align-items-center d-flex justify-content-center'>
                            {subOrg}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {user?.['https://hasura.io/jwt/claims'].sub_orgs.filter(value => value !== subOrg).map((item, index) => (
                                <Dropdown.Item key={index} onClick={() => changeSubOrg(item)}>
                                    {item}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Dropdown.ItemText>}
                <Dropdown.Item className="mb-3 mt-2 ps-2 d-none d-md-block text-danger" as={Link} to={`https://${orgData?.organisation[0]?.["openedx_endpoint"]}/dashboard-logout`}>
                    <i className="fe fe-power me-2"></i> Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}