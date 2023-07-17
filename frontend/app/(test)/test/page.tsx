'use client'
import React from "react";
import AppHandler from "@/app/app/AppHandler";
import AuthHandler from "@/app/(auth)/AuthHandler";
import DashboardHandler from "@/app/(pages)/dashboard/DashboardHandler";
import { IRootState } from "@/app/utils/store/store";
import { connect } from "react-redux";
import WaterTankWidget from "@/app/(pages)/dashboard/components/WaterTankWidget/WaterTankWidget";
import ContentBox from "@/app/components/contentBox/ContentBox";

const authHandler = AuthHandler.getInstance()
const appHandler = AppHandler.getInstance()
const dashboardHandler = DashboardHandler.getInstance()

interface ITestProps extends ReturnType<typeof mapStateToProps> { }

const Test: React.FunctionComponent<ITestProps> = (props: ITestProps) => {
    return (
        <div style={{ padding: '200px', position: "relative", height: "100%" }}>
            <ContentBox>
                <WaterTankWidget
                    id={1}
                    name={'Patio Tank'}
                    type={'storage'}
                    capacity={500}
                    dimensions={"240x200x100"}
                    brand={'Acme'}
                    material={'stainless steel'}
                    status={false}
                />
            </ContentBox>
        </div>
    )
}

function mapStateToProps(state: IRootState) {
    return {
    }
}

export default connect(mapStateToProps, {})(Test)
