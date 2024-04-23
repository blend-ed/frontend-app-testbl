const { gql, useMutation } = require("@apollo/client");

const SEND_NOTIFICATIONS = gql`
    mutation SendNotification($title: String!, $body: String!, $user_id: uuid!, $target: [String!]!, $sub_org: String!, $domain_scope: String!, $scheduled_time: timestamptz = null, $visibility: String = "student") {
        sendNotification(title: $title, body: $body, sender_id: $user_id, target: $target, sub_org: $sub_org, domain_scope: $domain_scope, scheduled_time: $scheduled_time, visibility: $visibility) {
            status
            message
            err_msg
        }
    }
`;

const useSendNotification = () => {
    const [sendNotification, { data, loading, error }] = useMutation(SEND_NOTIFICATIONS);

    return { sendNotification, data, loading, error };
}

export default useSendNotification;