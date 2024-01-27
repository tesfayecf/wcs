import React from 'react'
import { Dialog } from '@mui/material';

interface PopUpTemplateProps {
    children: React.ReactNode | React.ReactNode[];
    open: boolean;
    onClose: (ev: any) => void;
    hideBackDrop?: boolean;
    elevation?: number;
}

const PopUpTemplate: React.FunctionComponent<PopUpTemplateProps> = (props: PopUpTemplateProps) => {
    const handleKeyDown = (event: any) => {
        if (event.key === 'Escape') {
            props.onClose(event);
        }
    };

    return (
        <Dialog
            className={"popUp"}
            open={props.open}
            onClose={props.onClose}
            hideBackdrop={props.hideBackDrop}
            onKeyDown={handleKeyDown} // Attach the event handler
            PaperProps={{
                elevation: props.elevation ?? 5
            }}
        >
            {props.children}
        </Dialog>
    )
}

export default PopUpTemplate;
