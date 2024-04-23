// import node module libraries
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

// import layouts
import AllRoutes from './layouts/AllRoutes';
import ScrollToTop from './layouts/common/ScrollToTop';

// import required stylesheet
import 'simplebar/dist/simplebar.min.css';
import 'tippy.js/animations/scale.css';

// import Apollo libraries
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
    from,
    split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import SubOrgProvider from './context/providers/SubOrgProvider';
import { createClient } from 'graphql-ws';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';

const App = () => {

    const org = location.hostname.split('.')[1];
    var ORG = org;

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            // if (graphQLErrors[0].message === 'jwt expired') {
            //     window.location.replace('/login');
            // }
            graphQLErrors.map(({ message, locations, path }) => {
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );
            });
        }
    });

    const httpLink = createHttpLink({
        uri: process.env.REACT_APP_HASURA_URI,
    });

    const wsLink = new GraphQLWsLink(
        createClient({
            url: process.env.REACT_APP_HASURA_URI.replace('https', 'wss'),
            lazy: true,
            connectionParams: async () => {
                return {
                    headers: {
                        authorization: '',
                        'x-hasura-role': sessionStorage.getItem('role') || 'student',
                    },
                };
            },
        })
    );

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink
    );

    const createApolloClient = () => {
        return new ApolloClient({
            link: from([errorLink, splitLink]),
            cache: new InMemoryCache(),
        });
    };

    const client = createApolloClient();

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                {org && (
                    <Helmet>
                        <link
                            rel="icon"
                            href={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/favicon/${ORG}/favicon.ico`}
                        />
                    </Helmet>
                )}
                <ScrollToTop />
                <AllRoutes />
                <ToastContainer />
            </BrowserRouter>
        </ApolloProvider>
    );
};

export default App;
