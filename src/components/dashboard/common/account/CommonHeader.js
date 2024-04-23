import { Button, Card, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import UpdatePhoto from './UpdatePhoto';

export const CommonHeader = (props) => {

    const { name, profileImage, coverImage, refetch, yearOfBirth } = props

    return (
        <Card className="border-0 overflow-hidden">

            <UpdatePhoto name={name} profileImage={profileImage} refetch={refetch} toast={toast} yearOfBirth={yearOfBirth} />

        </Card>
    )
}