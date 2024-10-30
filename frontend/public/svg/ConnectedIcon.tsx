import React from 'react';

interface IConnectedIconProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    width?: number;
    height?: number;
    viewBox?: string;
    rotate?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    backgroundColor?: string;
    borderRadius?: number;
}

const ConnectedIcon: React.FunctionComponent<IConnectedIconProps> = (props: IConnectedIconProps) => {
    const {
        size = 24,
        strokeWidth = 1.5,
        stroke = "white",
        fill = "none",
        width = size,
        height = size,
        viewBox = `0 0 ${width} ${height}`,
        rotate = 0,
        flipHorizontal = false,
        flipVertical = false,
        backgroundColor = "transparent",
        borderRadius = 0,
    } = props;

    const transform = `rotate(${rotate} ${width / 2} ${height / 2}) ${flipHorizontal ? 'scale(-1, 1)' : ''} ${flipVertical ? 'scale(1, -1)' : ''}`;

    const svgStyle: React.CSSProperties = {
        backgroundColor,
        borderRadius: `${borderRadius}px`,
    };

    return (
        <svg width={width} height={height} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth} transform={transform} style={svgStyle}>
            <path
                d="M256 512C114.625 512 0 397.375 0 256S114.625 0 256 0s256 114.625 256 256-114.625 256-256 256Zm0-448C149.969 64 64 149.969 64 256s85.969 192 192 192 192-85.969 192-192S362.031 64 256 64Zm0 320a128 128 0 1 1 128-128 128.006 128.006 0 0 1-128 128Z"
            />
        </svg>
    );
}

export default ConnectedIcon;
