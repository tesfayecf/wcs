'use client'
import ContentBox from "@/app/components/contentBox/ContentBox";
import React from "react";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";

interface ITankGroupDescriptionProps extends ReturnType<typeof mapStateToProps> { }

const TankGroupDescription: React.FunctionComponent<ITankGroupDescriptionProps> = (props: ITankGroupDescriptionProps) => {
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
        description: state.tanks.groupInfo.description,
    }
}

export default connect(mapStateToProps, {})(TankGroupDescription)