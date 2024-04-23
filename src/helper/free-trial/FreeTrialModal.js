import GKStepper from '../../components/elements/stepper/GKStepper';
import { useState } from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import 'react-phone-input-2/lib/style.css';
import { ImportDemoProgram } from './ImportDemoProgram';

const FreeTrialModal = (props) => {

    const { freeTrialModalShow, handleCloseFreeTrialModal } = props;

    const [currentStep, setCurrentStep] = useState(1);

    const [demoProgramImported, setDemoProgramImported] = useState(false);

    const steps = [
        {
            id: 1,
            title: 'Get to know the platform',
            content: (
                <div className='px-4'>
                    <div className='position-relative' style={{ width: '100%', paddingTop: '56.25%' }}>
                        <iframe
                            style={{ width: '100%', height: '100%', top: 0, left: 0, bottom: 0, right: 0 }}
                            src="https://www.youtube.com/embed/7NG-DsnIkJk?si=T1Vqyun3Ajy8vQIg"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                            className='rounded position-absolute'
                        />
                    </div>
                    <div className='mt-6 mb-3 text-end'>
                        <Button className='px-6' onClick={() => setCurrentStep(2)}>
                            Next
                            <i className='fa-solid fa-arrow-right ms-2' />
                        </Button>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: 'Import Demo Program',
            content: (
                <ImportDemoProgram setCurrentStep={setCurrentStep} setDemoProgramImported={setDemoProgramImported} />
            )
        },
        {
            id: 3,
            title: 'Get Started',
            content: (
                <div className='px-4'>
                    <div className='text-center'>
                        <h2 className='text-primary'>Welcome to Blend-ed</h2>
                        <p className='mx-10'>
                            {demoProgramImported && 'You have successfully imported the demo program.'}{' '}
                            You can now explore the platform and create your own programs.
                        </p>
                    </div>
                    <div className='mt-6 mb-3 text-end'>
                        {!demoProgramImported && <Button variant='outline-primary' className='px-6 me-3' onClick={() => setCurrentStep(2)}>
                            <i className='fa-solid fa-arrow-left me-2' />
                            Back
                        </Button>}
                        <Button className='px-6' onClick={handleCloseFreeTrialModal}>
                            Get Started
                            <i className='fa-solid fa-arrow-right ms-2' />
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <Modal show={freeTrialModalShow} centered size='lg'>
            <Modal.Body>
                <GKStepper currentStep={currentStep} steps={steps} />
            </Modal.Body>
        </Modal>
    )
}

export default FreeTrialModal;