import React from 'react'

interface ISearchIconProps {
    size?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
}
const SearchIcon: React.FunctionComponent<ISearchIconProps> = (props: ISearchIconProps) => {
    const size = props.size ? props.size : 24;
    const strokeWidth = props.strokeWidth ? props.strokeWidth : 1.5;
    const stroke = props.stroke ? props.stroke : "white";
    const fill = props.fill ? props.fill : "none";
    const viewBox = `0 0 ${size} ${size}`
    return (
        <svg width={size} height={size} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" stroke={stroke} strokeWidth={strokeWidth} >
            <path
                d="M15.7955 15.8111 21 21m-3-10.5c0 4.1421-3.3579 7.5-7.5 7.5C6.35786 18 3 14.6421 3 10.5 3 6.35786 6.35786 3 10.5 3c4.1421 0 7.5 3.35786 7.5 7.5Z" />
        </svg >
    )
}

export default SearchIcon