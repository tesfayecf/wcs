'use client'
import { connect } from "react-redux"
import React from 'react';
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
import { Chart } from 'react-chartjs-2';
import { IRootState } from "@/app/utils/store/store";

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

interface ISummaryBarChartProps extends ReturnType<typeof mapStateToProps> {
    // data: ChartData<'bar'>;
    // options: ChartOptions<'bar'>;
}

const SummaryBarChart: React.FunctionComponent<ISummaryBarChartProps> = (props: ISummaryBarChartProps) => {

    return (
        <div className={"bar-chart"}>
            <Chart type='bar' data={data} options={defaultBarOptions} width={"100%"} />
        </div>
    )
}


const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(SummaryBarChart)


const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const data: ChartData<"bar" | "line"> = {
    labels,
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
};



// Dummy Bar Options
const defaultBarOptions: ChartOptions<'bar'> = {
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