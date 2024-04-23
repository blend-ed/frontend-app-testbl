import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../context/Context';
import { useContext } from 'react';
import { Carousel, Image, Placeholder } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

const GET_SUB_ORG_ID = gql`
  query getSubOrgId($sub_org: String = "", $org_url: String = "") {
    sub_org(
      where: {
        name: { _eq: $sub_org }
        organisation: { domain: { _eq: $org_url } }
      }
    ) {
      id
    }
  }
`;

const GET_BANNERS = gql`
    query getBanners($sub_org_name: String = "") {
        banners(where: {sub_org: {name: {_eq: $sub_org_name}}}) {
            banner
            url
            __typename
            id
        }
    }
`;

const Banner = () => {
    const { user } = useAuth0();

    const ConfigContext = useContext(SubOrgContext);
    const sub_org_plans = user?.['https://hasura.io/jwt/claims']['sub_org_plans'];

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const sub_org_name = 'localhost'
    var org = sub_org_name

    const { data: banners, loading } = useQuery(GET_BANNERS, {
        variables: {
            sub_org_name: sub_org_name,
        },
    });

    if (loading) {
        return (
            <div
                className="mt-md-2 mb-4 mb-md-5"
                style={{
                    aspectRatio: 4 / 1,
                    width: '100%',
                }}
            >
                <Placeholder as="div" animation="glow">
                    <Placeholder
                        xs={12}
                        style={{
                            aspectRatio: 4 / 1,
                            width: '100%',
                        }}
                        className="rounded overflow-hidden"
                    />
                </Placeholder>
            </div>
        );
    }

    const LinkBanner = ({ url, children }) => {
        if (url)
            return (
                <Link to={url} target="_blank">
                    {children}
                </Link>
            );
        return children;
    };

        return (
            <div className="mt-md-2 mb-4 mb-md-5">
                <Carousel
                    className="rounded overflow-hidden shadow-sm"
                    style={{
                        aspectRatio: 4 / 1,
                        width: '100%',
                    }}
                    indicators={false}
                    touch={isMobile}
                >
                    {!loading ? (
                        banners?.banners.map((item, index) => (
                            <Carousel.Item key={index} >
                                <LinkBanner url={item.url}>
                                    <Image
                                        src={item.banner}
                                        alt={`Slide-${index}`}
                                        className="fluid"
                                        style={{
                                            aspectRatio: 4 / 1,
                                            width: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                    />
                                </LinkBanner>
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <Placeholder as="div" animation="glow">
                                <Placeholder
                                    xs={12}
                                    style={{
                                        aspectRatio: 4 / 1,
                                        height: isMobile && '7rem',
                                        width: '100%',
                                    }}
                                    className="rounded overflow-hidden"
                                />
                            </Placeholder>
                        </Carousel.Item>
                    )}
                </Carousel>
            </div>
        );
};

export default Banner;
