'use client'
import React from 'react';
import { Dialog, PaperProps } from '@mui/material';

interface PopupProps {
    open: boolean;
    children: React.ReactNode | React.ReactNode[];
    onClose?: (ev: any) => void;
    customStyles?: React.CSSProperties;
    hideBackDrop?: boolean;
    paperProps?: PaperProps;
}

const Popup: React.FunctionComponent<PopupProps> = (props: PopupProps) => {
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
            PaperProps={props.paperProps}
        >
            {props.children}
        </Dialog>
    );
};

export default Popup;
