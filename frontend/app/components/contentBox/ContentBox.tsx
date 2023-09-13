import React, { ReactNode } from "react";

type IContentBoxProps = {
    children: ReactNode;
    customBoxClass?: string;
};

const ContentBox: React.FunctionComponent<IContentBoxProps> = (props) => {
    const boxClassName = `${"content_box"} ${props.customBoxClass || ""}`;

    return (
        <div id="content-box" className={boxClassName}>
            {props.children}
        </div>
    );
};

export default ContentBox;