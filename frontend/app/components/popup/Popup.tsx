'use client'

import React, { useEffect, useCallback } from 'react';
import { Dialog, PaperProps, Fade } from '@mui/material';
interface PopupProps {
    open: boolean;
    children: React.ReactNode | React.ReactNode[];
    onClose?: (ev: KeyboardEvent) => void;
    onEnter?: (ev: KeyboardEvent) => void;
    customStyles?: React.CSSProperties;
    hideBackdrop?: boolean;
    paperProps?: PaperProps;
    fullScreen?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    transitionDuration?: number;
}

const Popup: React.FunctionComponent<PopupProps> = (props: PopupProps) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && props.onClose) props.onClose(event);
        else if (event.key === 'Enter' && props.onEnter) props.onEnter(event);
    }, [props.onClose, props.onEnter]);

    useEffect(() => {
        if (props.open) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);;
    }, [props.open, handleKeyDown]);

    return (
        <Dialog
            className="popUp"
            style={props.customStyles}
            open={props.open}
            onClose={props.onClose}
            fullScreen={props.fullScreen}
            maxWidth={props.maxWidth ?? 'sm'}
            hideBackdrop={props.hideBackdrop}
            PaperProps={props.paperProps}
            TransitionComponent={Fade}
        >
            {props.children}
        </Dialog>
    );
};

export default Popup;