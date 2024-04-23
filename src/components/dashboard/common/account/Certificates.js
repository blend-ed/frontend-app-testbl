import { gql, useQuery } from "@apollo/client";
import CourseCover from 'assets/images/background/course-cover-img.jpg';
import { Card, Col, Image } from "react-bootstrap";


const GET_OPENEDX_ENDPOINT = gql`
    query getOpenedxEndpoint($org_url: String! = "") {
        organisation(where: {domain: {_eq: $org_url}}) {
          openedx_endpoint
        }
    }
`;

const Certificates = ({data}) => {

    const { data: openedxEndpoint } = useQuery(GET_OPENEDX_ENDPOINT, {
        variables: {
            org_url: window.location.origin
        }
    });

    data.userDetails.course_certificates.map((cert) => {
        console.log(cert)
    })

    return (
        <div>
            <h3 className="py-3">Certificates</h3>
            <Col xs={12} md={6} lg={6} className="mb-3">
                {data.userDetails.course_certificates.map((cert) => (
                    <Card className="certificate-card" key={cert.course_id}>
                        <Card.Img
                            variant="top"
                            src={cert.course_image}
                            onError={(e) => {
                                e.target.src = 'default-image.jpg'
                            }}
                            style={{
                                height: '200px',
                                objectFit: 'cover'
                            }}
                        />
                        <Card.Body>
                            <Card.Title className="pb-0 mb-0">{cert.course_display_name}</Card.Title>
                            <Card.Text>
                                <p className="text-dark">{cert.course_organization}</p>
                                <p className="text-danger">{cert.certificate_type}</p>
                                <p>Grade: {Math.floor(cert.grade * 100)} %</p>
                                <p>Issued Date: {new Date(cert.created_date).toLocaleDateString()}</p>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <a href={'https://'+openedxEndpoint?.organisation[0].openedx_endpoint+cert.download_url} target="_blank" rel="noopener noreferrer">Download Certificate</a>
                        </Card.Footer>
                    </Card>
                ))}
            </Col>
        </div>

    );
}

export default Certificates;

