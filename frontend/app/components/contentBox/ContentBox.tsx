import React, { ReactNode } from "react";
import styles from "./styles/ContentBox.module.scss"
import { JsxElement } from "typescript";

type IContentBoxProps = {
    children: ReactNode
}

const ContentBox: React.FunctionComponent<IContentBoxProps> = (props) => {
    return (
        <div id="content-box" className={styles.content_box} >
            {props.children}
        </div>
    )
}

export default ContentBox;