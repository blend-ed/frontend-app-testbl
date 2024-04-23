import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";

const GET_USER_DETAILS = gql`
    query getUserDetails($user_id: uuid = "", $domain: String = "") {
        user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}) {
            goals
            openedx_id
            year_of_birth
            annual_income_range
            country
            interest
            name
            occupation
            profile_image
            theme
            username
            default_suborg
            default_suborg_details {
                name
                id
            }
            id
            last_accessed_suborg
            org_id
            user_id
            mobile
            gender
            user {
                email
            }
        }
    }  
`

const useUserDetails = (user_id) => {

    const { user } = useAuth0();

    const { data: userDetails, loading: userDetailsLoading, refetch: userDetailsRefetch } = useQuery(GET_USER_DETAILS, {
        variables: {
            user_id: user_id ? user_id : user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            domain: window.location.origin
        }
    })

    return {
        userDetails: userDetails?.user_details[0],
        userDetailsLoading,
        userDetailsRefetch
    }
}

export default useUserDetails;