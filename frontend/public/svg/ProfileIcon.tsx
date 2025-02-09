import React from 'react';

interface IProfileIconProps {
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

const ProfileIcon: React.FunctionComponent<IProfileIconProps> = (props: IProfileIconProps) => {
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
            <path
                d="M10 10c-2.217 0-4.019-1.794-4.019-4S7.783 2 10 2s4.019 1.794 4.019 4-1.802 4-4.019 4m3.776.673a5.978 5.978 0 0 0 2.182-5.603C15.561 2.447 13.37.348 10.722.042 7.07-.381 3.972 2.449 3.972 6c0 1.89.88 3.574 2.252 4.673C2.852 11.934.39 14.895.004 18.891A1.012 1.012 0 0 0 1.009 20a.99.99 0 0 0 .993-.891C2.404 14.646 5.837 12 10 12s7.596 2.646 7.999 7.109a.99.99 0 0 0 .993.891c.596 0 1.06-.518 1.003-1.109-.385-3.996-2.847-6.957-6.22-8.218"
            />
        </svg>
    );
}

export default ProfileIcon;
