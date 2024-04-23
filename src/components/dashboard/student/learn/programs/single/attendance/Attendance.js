import { Fragment } from "react"
import CommonHeaderTabs from "../CommonHeaderTabs"
import { Card, Col, Row } from "react-bootstrap"
import { useParams } from "react-router-dom"
import AttendanceTable from "./AttendanceTable"

const Attendance = () => {
    const { id } = useParams()

    return (
        <Fragment>
            <CommonHeaderTabs id={id} />
            <Card>
                <AttendanceTable programId={id} />
            </Card>
        </Fragment>
    )
}

export default Attendance