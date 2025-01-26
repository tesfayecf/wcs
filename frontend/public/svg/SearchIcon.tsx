import React from 'react';

interface ISearchIconProps {
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

const SearchIcon: React.FunctionComponent<ISearchIconProps> = (props: ISearchIconProps) => {
    const {
        size = 24,
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
                d="M15.7955 15.8111 21 21m-3-10.5c0 4.1421-3.3579 7.5-7.5 7.5C6.35786 18 3 14.6421 3 10.5 3 6.35786 6.35786 3 10.5 3c4.1421 0 7.5 3.35786 7.5 7.5Z"
            />
        </svg>
    );
}

export default SearchIcon;
