'use client'
import React from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement, ChartData, ChartOptions, ChartTypeRegistry, BubbleDataPoint, LegendItem } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Legend, Tooltip, Filler);

interface IPieChartProps { }

const PieChartChartJS: React.FunctionComponent<IPieChartProps> = (props: IPieChartProps) => {
    const colors = ['#77c4a9', '#fae499', '#789abd', '#92c594', '#12f594'];
    const groups = [
        {
            name: "Group 1"
        },
        {
            name: "Group 2"
        },
        {
            name: "Group 3"
        }
    ]

    const level = [60, 30, 50]

    const getData = () => {
        const pieData = { ...defaultPieData }
        groups.map((group, index) => {
            pieData.labels.push(group.name)
            pieData.datasets[0].data.push(level[index])
            //@ts-ignore
            pieData.datasets[0].backgroundColor.push(colors[index]) // Error build
        })

        return pieData
    }

    const getOptions = () => {
        const pieOptions = { ...defaultPieOptions };
        return pieOptions
    }

    return (
        <div className={"pie-chart"}>
            <Pie data={getData()} options={getOptions()} className={"pie"} />
        </div>
    );
}

export default PieChartChartJS;



const defaultPieData: ChartData<'pie'> = {
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: [],
        },
    ],
};

// Dummy Pie Options
const defaultPieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const value = context.raw || 0;
                    const percentage = ((value / context.dataset.data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(2);
                    return `${percentage}%`;
                },
            },
        },
    },
    scales: {
        x: {
            display: false,
        },
        y: {
            display: false,
        },
    },
};
