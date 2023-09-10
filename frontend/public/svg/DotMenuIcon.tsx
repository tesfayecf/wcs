import React from 'react';

interface IDotMenuProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    width?: number; // Separate width and height props
    height?: number;
}

const DotMenu: React.FunctionComponent<IDotMenuProps> = (props: IDotMenuProps) => {
    const size = props.size ? props.size : 24;
    const strokeWidth = props.strokeWidth ? props.strokeWidth : 1.5;
    const stroke = props.stroke ? props.stroke : "white";
    const fill = props.fill ? props.fill : "none";
    const width = props.width ? props.width : size; // Use width prop or default to size
    const height = props.height ? props.height : size; // Use height prop or default to size
    const viewBox = `0 0 ${25} ${30}`; // Use width and height in viewBox

    return (
        <svg width={width} height={height} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth}>
            <path d="M13 16c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3zM13 26c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3zM13 6c0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3-3 1.346-3 3z" />
        </svg>
    );
};

export default DotMenu;
