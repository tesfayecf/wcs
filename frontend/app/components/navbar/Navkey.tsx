'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavKeyProps {
    text: string;
    index: string;
    icon?: JSX.Element;
}

const NavKey: React.FunctionComponent<NavKeyProps> = ({ text, index, icon }) => {
    const pathName = usePathname();
    const selected = pathName.includes(index);

    return (
        <Link href={index} passHref style={{ textDecoration: "inherit" }}>
            <div className={`navkey ${selected ? "selected" : ""}`}>
                <div id='icon' className={"icon"}>
                    {icon}
                </div>
                <span id='text' className={"text"} style={{ textDecoration: 'none' }}>
                    {text}
                </span>
            </div>
        </Link>
    );
};

export default NavKey;
