import { gql, useQuery } from "@apollo/client";
import { Badge, Button, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import CourseCover from '../../../../assets/images/background/course-cover-img.jpg';

const OPENEDX_URLS = gql`
    query getOrgId($_eq: String = "") {
        organisation(where: {domain: {_eq: $_eq}}) {
            openedx_endpoint
        }
    }
`

export const CertificateCard = ({ certificate }) => {

    const { data: orgData } = useQuery(OPENEDX_URLS, {
        variables: { _eq: window.location.origin }
    })

    return (
        <Card>
            <Card.Body className="p-3 border rounded card-hover">
                <Image
                    src={certificate.course_image}
                    className="rounded mb-3"
                    width={'100%'}
                    style={{ height: '8rem', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.src = CourseCover; // Set default image if there is an error
                    }}
                />
                <h4
                    className={`fw-semibold text-inherit text-truncate-line-2 mb-3`}
                    style={{
                        height: "2.8em",
                    }}
                >
                    {certificate.course_display_name}
                </h4>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="text-primary mb-0">{(certificate.certificate_type).toUpperCase()}</h5>
                    <Badge bg="success">{certificate.grade * 100}%</Badge>
                </div>
                <p className="mb-3 fs-6">Issued on:
                    <span className="fw-medium ms-2">{new Date(certificate.created_date).toLocaleString('en-IN')}</span>
                </p>
                <Button variant="outline-primary" size="sm" className="w-100" as={Link} to={`https://${orgData?.organisation[0]?.["openedx_endpoint"]}${certificate.download_url}`} target="_blank">View Certificate</Button>
            </Card.Body>
        </Card>
    );
}