import React from 'react';

interface ILogoIconProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    rotate?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    backgroundColor?: string;
    borderRadius?: number;
}

const LogoSmallIcon: React.FunctionComponent<ILogoIconProps> = (props: ILogoIconProps) => {
    const {
        size = 200,
        strokeWidth = 2.5,
        stroke = "black",
        fill = "black",
        rotate = 0,
        flipHorizontal = false,
        flipVertical = false,
        backgroundColor = "transparent",
        borderRadius = 0,
    } = props;

    const viewBox = "0 -0.5 9 9";

    const transform = `rotate(${rotate} 12 12) ${flipHorizontal ? 'scale(-1, 1)' : ''} ${flipVertical ? 'scale(1, -1)' : ''}`;

    const svgStyle: React.CSSProperties = {
        backgroundColor,
        borderRadius: `${borderRadius}px`,
    };

    return (
        <svg width={size} height={size} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth} transform={transform} style={svgStyle}>
            <path d="M9 3v2H5.625v3h-2.25V5H0V3h3.375V0h2.25v3z" />
        </svg>
    )
}

export default LogoSmallIcon;
