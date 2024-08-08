'use client'
import React from "react"
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler, ArcElement, ChartData, ChartOptions, ChartTypeRegistry, BubbleDataPoint, LegendItem,
    Plugin
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Point } from "chart.js/dist/core/core.controller";
import useDashboardStore from "../../store";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Legend, Tooltip, Filler);

interface ISummaryPieChartProps { }

const SummaryPieChart: React.FunctionComponent<ISummaryPieChartProps> = (props: ISummaryPieChartProps) => {
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
        groups.map((group, index) => {
            data.labels.push(group.name);
            data.datasets[0].data.push(summary.level[index]);
            //@ts-ignore
            data.datasets[0].backgroundColor.push(colors[index % colors.length]);
        })
        return data
    }

    const getOptions = () => {
        const options: ChartOptions<"pie"> = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "50%",
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

        let optionsExtended = options as any;
        // Add custom plugin info
        optionsExtended.plugins["textCenter"] = {
            text: getCenterText(),
        };

        return options
    }

    const getPlugins = () => {
        const plugins: Plugin<"pie">[] = [
            {
                id: "textCenter",
                afterDraw(chart, args, options: { text: string; fontSize: number }) {
                    const { ctx, chartArea: { top, left, right, bottom } } = chart;
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;

                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = "50px";
                    ctx.fillStyle = "#000";
                    ctx.fillText(options.text ?? "", centerX, centerY);
                    ctx.restore();
                },
            }
        ]
        return plugins;
    };

    const getCenterText = React.useCallback(() => {
        return `${summary.level.reduce((a, b) => a + b, 0)} L`; // TODO: store magnitud in user info
    }, [summary]);

    return (
        <div className={"pie-chart"}>
            <Chart type="pie" data={getData()} options={getOptions()} plugins={getPlugins()} style={{ width: "100%", height: "100%", padding: "10px" }} />
        </div>
    );
}

export default SummaryPieChart;