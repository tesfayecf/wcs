import React from 'react';
import styles from './styles/ButtonTemplate.module.scss';

interface ButtonTemplateProps {
    size: number;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // Accept React.MouseEvent as an argument
    className?: string; // You can pass additional custom classes
}

const ButtonTemplate: React.FC<ButtonTemplateProps> = (props: ButtonTemplateProps) => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        if (!props.disabled && props.onClick) {
            props.onClick(event); // Pass the event to the onClick prop
        }
    };

    return (
        <div
            className={`${styles.button} ${props.disabled ? styles.disabled : ''} ${props.className}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            style={{ height: props.size, width: props.size }}
        >
            <div className={styles.iconContainer}>
                {props.icon && props.icon}
            </div>
        </div>
    );
};

export default ButtonTemplate;
