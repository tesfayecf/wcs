'use client'
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
import useDashboardStore from '../../store';

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

interface ISummaryBarChartProps { }

const SummaryBarChart: React.FunctionComponent<ISummaryBarChartProps> = (props: ISummaryBarChartProps) => {
    const summary = useDashboardStore((state) => state.summary);

    const getData = () => {
        const chartData = { ...defaultChartData };
        chartData.datasets[0].data = summary.savings;
        chartData.datasets[1].data = summary.inflow;
        chartData.datasets[2].data = summary.outflow;

        return chartData;
    }

    return (
        <div className={"bar-chart"}>
            <Chart type='bar' data={getData()} options={defaultChartOptions} />
        </div>
    )
}

export default SummaryBarChart

// Chart data
const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const defaultChartData: ChartData<"bar" | "line"> = {
    labels,
    datasets: [
        {
            type: 'line' as const,
            label: 'Savings',
            borderColor: 'rgba(0,0,0,0)',
            pointRadius: 0,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            data: [],
        },
        {
            type: 'bar' as const,
            label: 'Inflow',
            backgroundColor: '#83ecbd',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            hoverBackgroundColor: '#37dd93',
            data: [],
        },
        {
            type: 'bar' as const,
            label: 'Outflow',
            backgroundColor: '#e68b77',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            hoverBackgroundColor: '#e96649',
            data: [],
        },
    ],
};

// Chart Options
const defaultChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // Remove legend
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