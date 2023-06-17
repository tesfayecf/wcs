import React, { ReactNode } from "react";
import style from "./styles/ContentBox.module.scss"
import { JsxElement } from "typescript";

type IContentBoxProps = {
    children: ReactNode
}

const ContentBox: React.FunctionComponent<IContentBoxProps> = (props) => {
    return (
        <div id="content-box" >
            {props.children}
        </div>
        // <div id="content-box" className="content-box" style={props.sytles}>
        // </div>
    )
}

export default ContentBox;