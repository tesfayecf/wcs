'use client'
import React from 'react';
import ContentBox from '@/app/components/contentBox/ContentBox';
import { Chart } from 'react-chartjs-2';

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

interface ITankWidgetWidgetProps { }

const DataWidget: React.FunctionComponent<ITankWidgetWidgetProps> = (props: ITankWidgetWidgetProps) => {

    return (
        <ContentBox customBoxClass={"dataWidget"}>
            <div className={"chart"}>
                <Chart type='bar' data={data} options={options} />
            </div>
        </ContentBox >

    )
}

export default DataWidget;

// Chart data
const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const data: ChartData<"bar" | "line"> = {
    labels: labels,
    datasets: [
        {
            type: 'line' as const,
            label: 'Savings',
            borderColor: '#f2c986',
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            data: generateRandomData(0, 100, labels.length),
        },
        {
            type: 'bar' as const,
            label: 'Inflow',
            backgroundColor: '#83ecbd',
            data: generateRandomData(0, 100, labels.length),
            borderColor: 'white',
            borderWidth: 2,
            hoverBackgroundColor: '#37dd93',
            hoverBorderColor: 'white',
            // borderRadius: 10,
        },
        {
            type: 'bar' as const,
            label: 'Outflow',
            backgroundColor: '#e68b77',
            data: generateRandomData(0, 100, labels.length),
            borderColor: 'white',
            borderWidth: 2,
            hoverBackgroundColor: '#e96649',
            hoverBorderColor: 'white',
            // borderRadius: 10,
        },
    ],
}

// Bar Options
const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true, // Remove legend
        },
    },
    scales: {
        x: {
            display: true, // Display x-axis labels
            ticks: {
                display: true, // Display tick labels
                color: '#97999a', // Set x-axis label color
            },
            grid: {
                drawOnChartArea: false, // Remove the grid lines
                drawTicks: false, // Remove ticks within the grid
            },
        },
        y: {
            display: true, // Remove y-axis labels
            ticks: {
                color: '#97999a', // Set y-axis label color
            },
        },
    },
};

function generateRandomData(min, max, length) {
    const data = [];
    for (let i = 0; i < length; i++) {
        const randomValue = Math.random() * (max - min) + min;
        data.push(randomValue.toFixed(2)); // Round to 2 decimal places
    }
    return data;
}