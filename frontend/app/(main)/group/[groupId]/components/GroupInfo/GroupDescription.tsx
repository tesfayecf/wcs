'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/lib/store/store";
import ContentBox from "@/app/components/contentBox/ContentBox";

interface IGroupDescriptionProps extends ReturnType<typeof mapStateToProps> { }

const GroupDescription: React.FunctionComponent<IGroupDescriptionProps> = (props: IGroupDescriptionProps) => {
    return (
        <ContentBox customBoxClass={"groupDescription"}>
            <div className={"descriptionContent"}>
                <div className={"descriptionTitle"}>
                    Description
                </div>
                <div className={"descriptionText"}>
                    {props.description}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dui sollicitudin, finibus ipsum in, faucibus felis. Mauris nisi orci, vestibulum in urna a, porttitor dignissim velit.
                </div>
            </div>
        </ContentBox>
    )
}

function mapStateToProps(state: IRootState) {
    return {
        description: state.group.groupInfo.description,
    }
}

export default connect(mapStateToProps, {})(GroupDescription)