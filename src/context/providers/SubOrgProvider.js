// import node module libraries
import { useEffect, useReducer, useState } from 'react';

// import context file
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../Context';
import { SubOrgReducer } from '../../reducers/SubOrgReducer';
import { gql, useQuery } from '@apollo/client';

const GET_USER_DETAILS = gql`
    query GetUserDetails($user_id: uuid = "", $domain: String = "") {
        user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}) {
            last_accessed_suborg_details {
                name
            }
            default_suborg_details {
                name
            }
        }
    }
`;

const SubOrgProvider = ({ children }) => {
    const { user } = useAuth0();

    const [subOrgMajor, setSubOrgMajor] = useState(user?.['https://hasura.io/jwt/claims'].sub_org ? user?.['https://hasura.io/jwt/claims'].sub_org : user?.['https://hasura.io/jwt/claims'].sub_orgs[0]);

    useEffect(() => {
        if (user?.['https://hasura.io/jwt/claims'].sub_org) {
            setSubOrgMajor(user?.['https://hasura.io/jwt/claims'].sub_org);
        } else {
            setSubOrgMajor(user?.['https://hasura.io/jwt/claims'].sub_orgs[0]);
        }
    }, [user]);

    const { loading, data } = useQuery(GET_USER_DETAILS, {
        variables: {
            user_id: user?.['https://hasura.io/jwt/claims']["x-hasura-user-id"],
            domain: window.location.origin
        }
    });

    const [selectedSubOrg, setSelectedSubOrg] = useState(null);

    useEffect(() => {
        if (!loading && data) {
            setSelectedSubOrg(data.user_details[0]?.default_suborg_details?.name || data.user_details[0]?.last_accessed_suborg_details?.name);
        }
    }, [loading, data]);

    useEffect(() => {
        var subOrg = (localStorage.getItem('subOrg') === 'null' || localStorage.getItem('subOrg') === 'undefined') ? selectedSubOrg : localStorage.getItem('subOrg');
        if (subOrg === null || subOrg === undefined) {
            subOrg = subOrgMajor;
        }
        localStorage.setItem('subOrg', subOrg);
    }, [selectedSubOrg]);

    const initialState = {
        subOrg: localStorage.getItem('subOrg')
    };

    const [subOrgState, subOrgStateDispatch] = useReducer(SubOrgReducer, initialState);

    useEffect(() => {
        subOrgStateDispatch({ type: 'CHANGE_SUBORG', payload: { subOrg: localStorage.getItem('subOrg') } });
    }, [user, selectedSubOrg]);

    return (
        <SubOrgContext.Provider value={{ subOrgState, subOrgStateDispatch }}>
            {children}
        </SubOrgContext.Provider>
    );
};

export default SubOrgProvider;