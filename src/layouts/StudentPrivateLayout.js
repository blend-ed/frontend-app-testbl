import { useAuth0 } from "@auth0/auth0-react";
import { Loading } from "../helper/Loading";

export const StudentPrivateLayout = ({ component }) => {

    const Component = component;

    // Render the original component if the user is authenticated
    return <Component />;
};
