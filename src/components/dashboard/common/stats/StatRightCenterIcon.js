const { Card } = require("react-bootstrap");

const StatRightCenterIcon = (props) => {
    const { title, value, iconName, iconColorVariant } = props;

    return (
        <Card border="light h-100">
            <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                        <h2 className="h1 fw-bold mb-0">{value}</h2>
                        <p className="mb-0 ">{title}</p>
                    </div>
                    <div>
                        <div
                            className={`icon-shape icon-md bg-light-${iconColorVariant} text-${iconColorVariant} rounded-circle`}
                        >
                            <i className={`fe fe-${iconName} fs-3`}></i>
                        </div>
                    </div>
            </Card.Body>
        </Card>
    );
};

export default StatRightCenterIcon;
