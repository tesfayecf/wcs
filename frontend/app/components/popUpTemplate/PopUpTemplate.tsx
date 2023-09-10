import React from 'react'
import { Dialog } from '@mui/material';
import styles from "./styles/PopUpTemplate.module.scss"

interface PopUpTemplateProps {
    children: React.ReactNode | React.ReactNode[];
    open: boolean;
    onClose: (ev: any) => void;
    hideBackDrop?: boolean;
}

const PopUpTemplate: React.FunctionComponent<PopUpTemplateProps> = (props: PopUpTemplateProps) => {
    const handleKeyDown = (event: any) => {
        if (event.key === 'Escape') {
            props.onClose(event);
        }
    };

    return (
        <Dialog
            className={styles.popUp}
            open={props.open}
            onClose={props.onClose}
            hideBackdrop={props.hideBackDrop}
            onKeyDown={handleKeyDown} // Attach the event handler
        >
            {props.children}
        </Dialog>
    )
}

export default PopUpTemplate;
