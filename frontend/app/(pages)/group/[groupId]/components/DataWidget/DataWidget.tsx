'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    ChartOptions,
    ChartData,
} from 'chart.js';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

interface ITankWidgetWidgetProps extends ReturnType<typeof mapStateToProps> {
}

const DataWidget: React.FunctionComponent<ITankWidgetWidgetProps> = (props: ITankWidgetWidgetProps) => {

    return (
        <ContentBox customBoxClass={"dataWidget"}>
            <div className={"dataWidgetContent"}>
                <div className={"selector"}>
                    CHART SELECTOR
                </div>
                <div className={"bar-chart"}>
                    <Bar data={data} options={options} width={"100%"} height={"100%"} />
                </div>
            </div>
        </ContentBox >

    )
}


function mapStateToProps(state: IRootState) {
    return {}
}

export default connect(mapStateToProps, {})(DataWidget)


const data: ChartData<'bar'> = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
        {
            label: 'Sales',
            data: [65, 59, 80, 81, 56],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'Expenses',
            data: [28, 48, 40, 19, 86],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ],
}

const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            labels: ['January', 'February', 'March', 'April', 'May'],
        },
        y: {
            beginAtZero: true,
        },
    },
}