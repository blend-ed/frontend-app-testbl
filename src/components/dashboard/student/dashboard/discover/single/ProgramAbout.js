// import node module libraries
import { Card } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

// import bootstrap icons

const ProgramAbout = ({ data, type }) => {

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <Card.Body className={'text-dark fs-4 lh-3' + (isMobile ? ' mb-5' : '')}>
            <h3 className='mb-3'>
                {type === 'about' ? 'About the Program' : 'What you will learn'}
            </h3>
            <div className='p-3 bg-light rounded border'>
                <div dangerouslySetInnerHTML={{ __html: data }} className='mb-n3' />
            </div>
        </Card.Body>
    );
};

export default ProgramAbout;
