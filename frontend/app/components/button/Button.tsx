import React from 'react';

interface ButtonProps {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const baseClassName = 'button';

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!props.disabled && props.onClick) {
            props.onClick(event);
        }
    };

    return (
        <button
            className={`${baseClassName} ${props.className}`}
            onClick={handleClick}
            disabled={props.disabled}
            type={props.type}
            aria-label={props.ariaLabel}
        >
            {props.icon && <span className="iconContainer">{props.icon}</span>}
            {props.children}
        </button>
    );
};

export default Button;