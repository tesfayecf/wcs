import React from 'react';
import { Dialog } from '@mui/material';

interface PopUpTemplateProps {
    open: boolean;
    children: React.ReactNode | React.ReactNode[];
    onClose: (ev: any) => void;
    customStyles?: React.CSSProperties;
    hideBackDrop?: boolean;
    elevation?: number;
}

const PopUpTemplate: React.FunctionComponent<PopUpTemplateProps> = (
    props: PopUpTemplateProps
) => {
    const handleKeyDown = (event: any) => {
        if (event.key === 'Escape') {
            props.onClose(event);
        }
    };

    return (
        <Dialog
            className={'popUp'}
            style={props.customStyles}
            open={props.open}
            onClose={props.onClose}
            hideBackdrop={props.hideBackDrop}
            onKeyDown={handleKeyDown}
            PaperProps={{
                elevation: props.elevation ?? 5,
            }}
        >
            {props.children}
        </Dialog>
    );
};

export default PopUpTemplate;
