'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type INavKeyProps = {
    text: string;
    index: string;
    icon?: JSX.Element;
}

const NavKey: React.FunctionComponent<INavKeyProps> = (props: INavKeyProps) => {
    const pathname = usePathname();
    const selected = pathname.includes(props.index);
    const selectedSytle = selected ? `${"selected"}` : '';
    const textClass = `${selectedSytle} ${"text"}`
    const iconClass = `${selectedSytle} ${"icon"}`
    return (
        <div  >
            <Link href={props.index} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                <div id='navkey' className={"navkey"}>
                    <div id='icon' className={iconClass}>
                        {props.icon}
                    </div>
                    <span id='text' className={textClass} style={{ textDecoration: 'none' }}>
                        {props.text}
                    </span>
                </div>
            </Link >
        </div>

    )
}

export default NavKey;
