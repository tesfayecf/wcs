import React from 'react';

interface IAnalyticsIconProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    viewBox?: string;
    rotate?: number; // Rotation angle in degrees
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    backgroundColor?: string;
    borderRadius?: number;
}

const AnalyticsIcon: React.FunctionComponent<IAnalyticsIconProps> = (props: IAnalyticsIconProps) => {
    const {
        size = 75,
        strokeWidth = 1.5,
        stroke = "white",
        fill = "none",
        viewBox = `0 0 ${size} ${size}`,
        rotate = 0,
        flipHorizontal = false,
        flipVertical = false,
        backgroundColor = "transparent",
        borderRadius = 0,
    } = props;

    const transform = `rotate(${rotate} ${size / 2} ${size / 2}) ${flipHorizontal ? 'scale(-1, 1)' : ''} ${flipVertical ? 'scale(1, -1)' : ''}`;

    const svgStyle: React.CSSProperties = {
        backgroundColor,
        borderRadius: `${borderRadius}px`,
    };

    return (
        <svg width={size} height={size} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth} transform={transform} style={svgStyle}>
            <path fillRule="evenodd" clipRule="evenodd"
                d="M3 13C4.65685 13 6 14.3431 6 16V21C6 22.6569 4.65685 24 3 24C1.34315 24 0 22.6569 0 21V16C0 14.3431 1.34315 13 3 13zM11 0C12.6569 0 14 1.34315 14 3V21C14 22.6569 12.6569 24 11 24C9.3431 24 8 22.6569 8 21V3C8 1.34315 9.3431 0 11 0zM19 7C20.6569 7 22 8.34315 22 10V21C22 22.6569 20.6569 24 19 24C17.3431 24 16 22.6569 16 21V10C16 8.34315 17.3431 7 19 7z" />
        </svg>
    );
}

export default AnalyticsIcon;

