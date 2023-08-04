import React, { ReactNode } from "react";
import styles from "./styles/ContentBox.module.scss";

type IContentBoxProps = {
    children: ReactNode;
    customBoxClass?: string;
};

const ContentBox: React.FunctionComponent<IContentBoxProps> = (props) => {
    const boxClassName = `${styles.content_box} ${props.customBoxClass || ""}`;

    return (
        <div id="content-box" className={boxClassName}>
            {props.children}
        </div>
    );
};

export default ContentBox;