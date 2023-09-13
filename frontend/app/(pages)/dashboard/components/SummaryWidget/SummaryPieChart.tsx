import { connect } from "react-redux"
import styles from './styles/SummaryWidget.module.scss'
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartData, ChartOptions
} from 'chart.js';

import { Pie } from 'react-chartjs-2';
import { IRootState } from "@/app/utils/store/store";

ChartJS.register(CategoryScale, LinearScale, PointElement,
    LineElement, Title, Legend, Tooltip, Filler
);

interface ISummaryPieChartProps {
    data: ChartData<'pie'>;
    options: ChartOptions<'pie'>;
}

const SummaryPieChart: React.FunctionComponent<ISummaryPieChartProps> = (props: ISummaryPieChartProps) => {

    return (
        <div className={styles.chartContainer} >
            <Pie id={"summaryPieCharts"} data={props.data} options={props.options} className={styles.chart} />
        </div>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(SummaryPieChart)


