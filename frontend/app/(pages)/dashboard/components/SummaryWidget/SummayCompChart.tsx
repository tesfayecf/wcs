'use client'
import { connect } from "react-redux"
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartData, ChartOptions
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { IRootState } from "@/app/utils/store/store";

ChartJS.register(CategoryScale, LinearScale, PointElement,
    LineElement, Title, Legend, Tooltip, Filler
);

interface ISummaryCompChartProps {
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
}

const SummaryCompChart: React.FunctionComponent<ISummaryCompChartProps> = (props: ISummaryCompChartProps) => {

    return (
        <div className={"chartContainer"} >
            <Line id={"summaryPieCharts"} data={props.data} options={props.options} className={"chart"} />
        </div>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(SummaryCompChart)


