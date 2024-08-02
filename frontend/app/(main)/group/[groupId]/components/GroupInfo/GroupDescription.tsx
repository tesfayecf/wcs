'use client'
import React from "react";
import ContentBox from "@/app/components/contentBox/ContentBox";
import useGroupStore from "@/app/(main)/group/[groupId]/store";

interface IGroupDescriptionProps { }

const GroupDescription: React.FunctionComponent<IGroupDescriptionProps> = (props: IGroupDescriptionProps) => {
    const description = useGroupStore(state => state.group.description)

    return (
        <ContentBox customBoxClass={"groupDescription"}>
            <div className={"descriptionContent"}>
                <div className={"descriptionTitle"}>
                    Description
                </div>
                <div className={"descriptionText"}>
                    {description}
                </div>
            </div>
        </ContentBox>
    )
}

export default GroupDescription;