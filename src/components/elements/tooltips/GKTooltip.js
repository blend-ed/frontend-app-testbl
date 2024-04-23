import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const GKTooltip = ({ children, tooltipText,position='top' }) => {
    return (
        <OverlayTrigger
            key="top"
            placement={position}
            overlay={
                <Tooltip>
                    <span className='text-primary'>
                        {tooltipText} 
                    </span>
                </Tooltip>
            }
        >
            {children}
        </OverlayTrigger>
    );
};

export default GKTooltip;