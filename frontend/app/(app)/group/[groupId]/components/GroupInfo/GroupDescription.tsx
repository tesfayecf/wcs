import React from "react";
import ContentBox from "@/app/components/contentBox/ContentBox";
import { useGroupStore } from "@/app/(app)/group/[groupId]/store";

interface IGroupDescriptionProps {
    description: string;
}

const GroupDescription: React.FunctionComponent<IGroupDescriptionProps> = (props: IGroupDescriptionProps) => {
    return (
        <ContentBox customBoxClass={"groupDescription"}>
            <div className={"descriptionContent"}>
                <div className={"descriptionTitle"}>
                    Description
                </div>
                <div className={"descriptionText"}>
                    {props.description}
                </div>
            </div>
        </ContentBox>
    )
}

export default GroupDescription;