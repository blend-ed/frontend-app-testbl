import { useAuth0 } from "@auth0/auth0-react"
import { useParams } from "react-router-dom";

const LoginEmail = () => {
    const { id } = useParams();

    const { loginWithRedirect } = useAuth0();

    loginWithRedirect({authorizationParams: {
        login_hint: id,
    }});
}

export default LoginEmail;