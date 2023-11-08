import React from 'react';

interface IDotMenuProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    width?: number; // Separate width and height props
    height?: number;
    rotate?: number; // Rotation angle in degrees
    flipHorizontal?: boolean;
    flipVertical?: boolean;
}

const DotMenu: React.FunctionComponent<IDotMenuProps> = (props: IDotMenuProps) => {
    const {
        size = 24,
        strokeWidth = 1.5,
        stroke = "white",
        fill = "none",
        width = size,
        height = size,
        rotate = 0,
        flipHorizontal = false,
        flipVertical = false,
    } = props;

    const viewBox = `0 0 ${width} ${height}`;

    const transform = `rotate(${rotate} ${width / 2} ${height / 2}) ${flipHorizontal ? 'scale(-1, 1)' : ''} ${flipVertical ? 'scale(1, -1)' : ''}`;

    return (
        <svg width={width} height={height} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth} transform={transform}>
            <path d="M13 16c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3zM13 26c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3zM13 6c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3z" />
        </svg>
    );
};

export default DotMenu;
