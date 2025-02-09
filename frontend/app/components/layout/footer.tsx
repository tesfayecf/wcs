'use client'
import React from 'react'

interface IFooterProps { }

const Footer: React.FunctionComponent<IFooterProps> = (props: IFooterProps) => {
    return (
        <div id="footer" className="footer">
            <p className={"text"}>
                © 2023-2025 All rights reserved by WCS S.L.
            </p>
        </div>
    )
};

export default Footer;
