'use client'
import React from "react"
import { connect } from "react-redux";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement, ChartData, ChartOptions, ChartTypeRegistry, BubbleDataPoint, LegendItem } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { IRootState } from "@/app/utils/store/store";
import { Point } from "chart.js/dist/core/core.controller";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Legend, Tooltip, Filler);

interface ISummaryPieChartProps extends ReturnType<typeof mapStateToProps> {
    // data: ChartData<'pie'>;
    // options: ChartOptions<'pie'>;
}

const SummaryPieChart: React.FunctionComponent<ISummaryPieChartProps> = (props: ISummaryPieChartProps) => {

    const colors = ['#83ecbd', '#e68b77', '#f2c986', '#92c594', '#12f594'];

    const renderLegend = () => {
        return props.groups.map((group, index) => {
            const random = Math.floor(Math.random() * colors.length)
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

    const getPieData = () => {

        const pidData: ChartData<'pie'> = {
            labels: [],
            datasets: [
                {
                    data: [], // Replace with your actual data values
                    backgroundColor: [], // Replace with your desired colors
                },
            ],
        };

        props.groups.map((group, index) => {
            pidData.labels.push(group.name)
            pidData.datasets[0].data.push(Math.random() * 100)
            pidData.datasets[0].backgroundColor!.push(colors[index])
        })

        return pidData
    }

    return (
        <div className={"pie-chart"}>
            <div className={"legend"}>
                {renderLegend()}
            </div>
            <div className={"chart"}>
                <Pie data={getPieData()} options={defaultPieOptions} width={"100%"} />
            </div>
        </div>
    );
}

const mapStateToProps = (state: IRootState) => {
    return {
        groups: state.dashboard.groups
    };
}

export default connect(mapStateToProps, {})(SummaryPieChart);

// Dummy Pie Data


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

// Dummy Pie Options
const defaultPieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '40%',
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
