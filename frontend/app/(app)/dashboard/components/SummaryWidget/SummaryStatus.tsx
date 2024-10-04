'use client'
import React from "react"
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler, ArcElement, ChartData, ChartOptions, ChartTypeRegistry, BubbleDataPoint, LegendItem,
    Plugin
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import useDashboardStore from "../../store";
import { IGroupStatus } from "../../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Legend, Tooltip, Filler);

interface ISummaryPieChartProps {
    summaryStatus: IGroupStatus[]
}

const SummaryStatus: React.FunctionComponent<ISummaryPieChartProps> = (props: ISummaryPieChartProps) => {
    const groups = useDashboardStore((state) => state.groups);
    const summary = useDashboardStore((state) => state.summary);
    const colors = ['#77c4a9', '#fae499', '#789abd', '#92c594', '#12f594']; // TODO: add color to group

    const getData = () => {
        const data: ChartData<"pie"> = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    borderColor: "rgba(0,0,0,0)",
                    spacing: 2,
                    hoverBorderWidth: 2,
                    hoverOffset: 3,
                },
            ],
        };

        let empty = 0;

        groups.forEach((group, index) => {
            const groupData = props.summaryStatus.find(g => g.id === group.id);
            if (groupData) {
                empty = Math.max(groupData.capacity - groupData.level, 0);

                data.labels.push(groupData.name);
                data.datasets[0].data.push(groupData.level);
                //@ts-ignore
                data.datasets[0].backgroundColor.push(colors[index % colors.length]);
            }

        });

        data.labels.push("Empty");
        data.datasets[0].data.push(empty);
        //@ts-ignore
        data.datasets[0].backgroundColor.push("rgba(240, 240, 240, 1)");

        return data
    }

    const getOptions = () => {
        const options: ChartOptions<"pie"> = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "50%",
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context: any) => {
                            const value = context.raw || 0;
                            const percentage = ((value / context.dataset.data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(2);
                            return `${percentage}%`;
                        },
                    },
                },
            },
        };

        return options
    }

    return (
        <div className={"pie-chart"}>
            <Chart type="pie" data={getData()} options={getOptions()} style={{ width: "100%", height: "100%", padding: "10px" }} />
        </div>
    );
}

export default SummaryStatus;