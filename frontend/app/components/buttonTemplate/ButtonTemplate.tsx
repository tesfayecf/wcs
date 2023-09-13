import React from 'react';

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
            className={`${"button"} ${props.disabled ? "disabled" : ''} ${props.className}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            style={{ height: props.size, width: props.size }}
        >
            <div className={"iconContainer"}>
                {props.icon && props.icon}
            </div>
        </div>
    );
};

export default ButtonTemplate;
