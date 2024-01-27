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

const LogoIcon: React.FunctionComponent<ILogoIconProps> = (props: ILogoIconProps) => {
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

    const viewBox = `0 0 500 750`;

    const transform = `rotate(${rotate} 12 12) ${flipHorizontal ? 'scale(-1, 1)' : ''} ${flipVertical ? 'scale(1, -1)' : ''}`;

    const svgStyle: React.CSSProperties = {
        backgroundColor,
        borderRadius: `${borderRadius}px`,
    };

    return (
        <svg width={size} height={size} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth} transform={transform} style={svgStyle}>
            <g><text font-family="Raleway" font-size="100" font-weight="900"
                transform="translate(300 100)">
                <tspan x="-262.34" y="32.98">S</tspan>
                <tspan x="-187.06" y="32.98">M</tspan>
                <tspan x="-86.89" y="32.98">A</tspan>
                <tspan x="-13.18" y="32.98">T</tspan>
                <tspan x="62.84" y="32.98">E</tspan>
                <tspan x="136.03" y="32.98">R</tspan>
                <tspan x="217.4" y="32.98">+</tspan>
            </text></g>
        </svg>
    )
}

export default LogoIcon;
