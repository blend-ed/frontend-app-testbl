import { gql, useQuery } from '@apollo/client';
import { SubOrgContext } from '../../../../../../../context/Context';
import { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';

const GET_BLOCK_PROGRESS = gql`
	query getblockprogress($org_url: String="", $sub_org: String="", $user_id: uuid="") {
		blockProgress(org_url: $org_url, sub_org: $sub_org, user_id: $user_id) {
            block_progress
			overall_completion_percentage
            err_msg
		}
	}
`

const ProgramProgress = ({ id, user, programGradePercentage }) => {

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [programBlockPercentage, setProgramBlockPercentage] = useState(null)
    const [programTotalBlocks, setProgramTotalBlocks] = useState(null)
    const [programCompletedBlocks, setProgramCompletedBlocks] = useState(null)

    const { data: blockProgressData } = useQuery(GET_BLOCK_PROGRESS, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]
        },
        skip: !sub_org_name
    })

    useEffect(() => {
        if (blockProgressData && blockProgressData.blockProgress.block_progress) {
            const programData = blockProgressData.blockProgress.block_progress?.find((program) => program.program_id === id);
            setProgramBlockPercentage(programData.program_completion_percentage)
            setProgramTotalBlocks(programData.total_blocks)
            setProgramCompletedBlocks(programData?.completed_blocks)
        }
    }, [blockProgressData])

    console

    return (
        <Card className='mb-4'>
            <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                    <Card.Title as="h5">
                        Block Compleion
                    </Card.Title>
                    <Card.Text>
                        <span className="text-primary h5">{programCompletedBlocks} </span>
                        / {programTotalBlocks}
                    </Card.Text>
                </div>
                <ProgressBar style={{ height: '.5rem' }} now={programBlockPercentage}/>
            </Card.Body>
            <hr className='m-0' />
            <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                    <Card.Title as="h5">
                        Grade Completion
                    </Card.Title>
                    <Card.Text>
                        <span className="text-primary h5">{Math.floor(programGradePercentage)}%</span>
                    </Card.Text>
                </div>
                <ProgressBar variant='primary' now={Math.floor(programGradePercentage)} style={{ height: '.5rem' }} />
            </Card.Body>
        </Card>
    )
}

export default ProgramProgress;