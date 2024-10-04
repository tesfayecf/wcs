'use client'
import React from 'react';
import 'chartjs-adapter-date-fns'; // Import date-fns adapter for date formatting
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    TimeScale,
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
import { IGroupLevel } from '../../types';

ChartJS.register(
    LinearScale,
    CategoryScale,
    TimeScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);

interface ISummaryBarChartProps {
    summaryLevel: IGroupLevel[]
}

const SummaryLevel: React.FunctionComponent<ISummaryBarChartProps> = (props: ISummaryBarChartProps) => {

    const getData = () => {
        console.log(props.summaryLevel[0])
        const data: ChartData<'line'> = {
            labels: [],
            datasets: props.summaryLevel.map((group, index) => ({
                label: group.name,
                borderColor: `hsl(${index * 50}, 70%, 50%)`,
                backgroundColor: `hsla(${index * 50}, 70%, 50%, 0.3)`,
                pointRadius: 3,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                data: group.time.map((time, i) => ({
                    x: time * 1000,
                    y: group.level[i],
                })),
            })),
        };

        return data;
    };

    const getOptions = () => {
        const options: ChartOptions<'line'> = {
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
                    type: 'time',
                    time: {
                        unit: 'minute', // Adjust this based on your data granularity (e.g., 'day', 'week', 'month')
                        tooltipFormat: 'PP', // Format for the tooltip
                        displayFormats: {
                            month: 'MMM d, HH:mm:ss', // Display format for the x-axis labels
                        },
                    },
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
        }
        return options;
    }

    return (
        <div className={"bar-chart"}>
            <Chart type='line' data={getData()} options={getOptions()} />
        </div>
    )
}

export default SummaryLevel

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
