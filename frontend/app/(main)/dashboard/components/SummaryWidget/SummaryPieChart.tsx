'use client'
import React from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement, ChartData, ChartOptions, ChartTypeRegistry, BubbleDataPoint, LegendItem } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Point } from "chart.js/dist/core/core.controller";
import useDashboardStore from "../../store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Legend, Tooltip, Filler);

interface ISummaryPieChartProps { }

const SummaryPieChart: React.FunctionComponent<ISummaryPieChartProps> = (props: ISummaryPieChartProps) => {
    const groups = useDashboardStore((state) => state.groups);
    const summary = useDashboardStore((state) => state.summary);
    const colors = ['#77c4a9', '#fae499', '#789abd', '#92c594', '#12f594'];

    const renderLegend = () => {
        return groups.map((group, index) => {
            return (
                <div key={index} className="legend-item">
                    <span className={"dot"} style={{ backgroundColor: colors[index] }}></span>
                    <div className={"label"}>
                        {group.name}
                    </div>
                </div >
            )
        });
    }

    const getData = () => {
        const pieData = { ...defaultPieData }
        pieData.datasets[0].data = summary.level;
        groups.map((group, index) => {
            pieData.labels.push(group.name)
            // pieData.datasets[0].data.push(summary.level[index])
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
            <div className={"legend"}>
                {renderLegend()}
            </div>
            <div className={"chart"}>
                <Pie data={getData()} options={getOptions()} />
            </div>
        </div>
    );
}

export default SummaryPieChart;

const generateLabels = (chart: ChartJS<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint)[], unknown>) => {
    let legendItems: LegendItem[] = []
    chart.data.labels.forEach((label, index) => {
        legendItems.push({
            text: label as string,
            fillStyle: chart.data.datasets[0].backgroundColor[index],
            fontColor: "#97999a",
        })
    })
    return legendItems
}

const defaultPieData: ChartData<'pie'> = {
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: [],
            borderColor: "rgba(0,0,0,0)",
            spacing: 5,
            hoverBorderWidth: 10,
            hoverOffset: 7,
        },
    ],
};

// Dummy Pie Options
const defaultPieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    radius: "150%",
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


interface CustomLegendProps {
    labels: string[];
    backgroundColors: string[];
}

const CustomLegend: React.FunctionComponent<CustomLegendProps> = ({ labels, backgroundColors }) => {
    return (
        <div className="legend">
            {labels.map((label, index) => (
                <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: backgroundColors[index] }}></span>
                    <span className="legend-label">{label}</span>
                </div>
            ))}
        </div>
    );
};
