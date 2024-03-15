import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartData, ChartOptions
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement,
    LineElement, Title, Legend, Tooltip, Filler
);

interface IheaderChartProps {
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
}

const InfoChart: React.FunctionComponent<IheaderChartProps> = (props: IheaderChartProps) => {

    return (
        <div className={"line-chart"} >
            <Line id={"infoChart"} data={props.data} options={props.options} />
        </div>
    )
}

export default InfoChart;


