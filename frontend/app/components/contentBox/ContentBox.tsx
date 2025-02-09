import React, { ReactNode } from "react";

type IContentBoxProps = {
    children: ReactNode;
    customBoxClass?: string;
    isLoading?: boolean;
    isError?: boolean;
};

const ContentBox: React.FunctionComponent<IContentBoxProps> = (props) => {
    const boxClassName = `${"content_box"} ${props.customBoxClass || ""}`;

    if (props.isLoading) {
        return <div className="content-box-loading">
            <div className={"loading"}>
                Loading...
            </div>
        </div>;
    }

    if (props.isError) {
        return <div className="content-box-error">
            <div className={"error"}>
                Error
            </div>
        </div>;
    }

    return (
        <div id="content-box" className={boxClassName}>
            {props.children}
        </div>
    );
};

export default ContentBox;