import React from 'react'
import { Dialog } from '@mui/material';
import styles from "./styles/PopUpTemplate.module.scss"

interface PopUpTemplateProps {
    children: React.ReactNode | React.ReactNode[];
    open: boolean;
    onClose: () => void;
    hideBackDrop?: boolean;
}

const PopUpTemplate: React.FunctionComponent<PopUpTemplateProps> = (props: PopUpTemplateProps) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            props.onClose();
            setIsOpen(false)
        }
    };

    return (
        <Dialog
            className={styles.popUp}
            open={isOpen}
            onClose={props.onClose}
            hideBackdrop={props.hideBackDrop}
            onKeyDown={handleKeyDown} // Attach the event handler
        >
            {props.children}
        </Dialog>
    )
}

export default PopUpTemplate;
