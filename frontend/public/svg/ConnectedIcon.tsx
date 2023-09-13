import React from 'react';

interface IConnectedIconProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    width?: number; // Separate width and height props
    height?: number;
}

const ConnectedIcon: React.FunctionComponent<IConnectedIconProps> = (props: IConnectedIconProps) => {
    const size = props.size ? props.size : 24;
    const strokeWidth = props.strokeWidth ? props.strokeWidth : 1.5;
    const stroke = props.stroke ? props.stroke : "white";
    const fill = props.fill ? props.fill : "none";
    const width = props.width ? props.width : size; // Use width prop or default to size
    const height = props.height ? props.height : size; // Use height prop or default to size
    const viewBox = `0 0 ${25} ${30}`; // Use width and height in viewBox

    return (
        <svg width={width} height={height} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth}>
            <path
                d="M256 512C114.625 512 0 397.375 0 256S114.625 0 256 0s256 114.625 256 256-114.625 256-256 256Zm0-448C149.969 64 64 149.969 64 256s85.969 192 192 192 192-85.969 192-192S362.031 64 256 64Zm0 320a128 128 0 1 1 128-128 128.006 128.006 0 0 1-128 128Z"
            />
        </svg>
    );
};

export default ConnectedIcon;
