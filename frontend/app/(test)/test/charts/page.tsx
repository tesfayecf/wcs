import PieChartChartJS from "@/app/components/charts/chartJS/PieChart";
import PieChartRecharts from "@/app/components/charts/recharts/PieChart";
import React from "react";

interface IApiProps { }

const CHARTS: React.FunctionComponent<IApiProps> = async (props: IApiProps) => {

    return (
        <div id={"charts"} className={"chart-test"}>
            <div id={"pie-chart"} className={"pie-chart"}>
                <h1>PIE CHART</h1>
                <div className={"charts"}>
                    <div className={"chartjs"}>
                        <PieChartChartJS />
                    </div>
                    <div className={"recharts"}>
                        {/* <PieChartRecharts /> */}
                    </div>
                </div>
            </div>

        </div>
    )
};

export default CHARTS;
