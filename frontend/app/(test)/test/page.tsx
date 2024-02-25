'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/lib/store/store";

interface ITestProps extends ReturnType<typeof mapStateToProps> { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <></>
    )
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Test)
