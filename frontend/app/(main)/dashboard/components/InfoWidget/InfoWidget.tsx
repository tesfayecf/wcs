'use client'
import React from "react";
import ContentBox from "@/app/components/contentBox/ContentBox"

import { ChartData, ChartOptions } from "chart.js";
import InfoChart from "@/app/(main)/dashboard/components/InfoWidget/InfoChart";
import { HEXToRGBA } from "@/app/lib/utils/styles"

interface IHeaderWidgetProps {
    title: string,
    value: number,
    changeValue: number,
    color: string;
}

const InfoWidget: React.FunctionComponent<IHeaderWidgetProps> = (props: IHeaderWidgetProps) => {

    const renderTextData = React.useCallback(() => {
        let unit: string;
        if (props.title === 'Inflow') {
            unit = 'L'
        } else if (props.title === 'Outflow') {
            unit = 'L'
        } else if (props.title === 'Savings') {
            unit = '€'
        }

        let direction: string;
        let color: string;

        if (props.changeValue > 0) {
            direction = '↑';
            color = '#3de198'; // $graph-color-1
        } else {
            direction = '↓';
            color = '#e07159'; // $graph-color-4
        }

        return (
            <div className={"text"}>
                <span className={"title"}>{props.title}</span>
                <span className={"value"}>{props.value} {unit}</span>
                <div className={"change"}>
                    <span className={"value"} style={{ color: color }}>{props.changeValue}% {direction}</span>
                    <span className={"text"}>  than last month</span>
                </div>
            </div>
        )
    }, [props.title, props.value, props.changeValue])

    const getCustomOptions = React.useCallback((colorStart: string, colorEnd: string) => {
        const customOptions: ChartOptions<'line'> = {
            ...options,
            elements: {
                ...options.elements,
                line: {
                    ...options.elements.line,
                    borderColor: props.color,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 50);
                        gradient.addColorStop(0, colorStart);
                        gradient.addColorStop(1, colorEnd);
                        return gradient
                    }
                }
            }
        }
        return customOptions;
    }, [props.color])

    return (
        <ContentBox customBoxClass={"infoWidget"}>
            <div className={"infoWidgetContent"}>
                {renderTextData()}
                <InfoChart
                    data={data}
                    options={
                        getCustomOptions(
                            HEXToRGBA(props.color, 0.9),
                            HEXToRGBA(props.color, 0.1)
                        )
                    }
                />
            </div>
        </ContentBox >
    )
}

export default InfoWidget;

const labels = [
    "1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d",
    "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"
];

const data: ChartData<'line'> = {
    labels: labels,
    datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
    },
    elements: {
        line: {
            tension: 0,
            borderWidth: 1,
            fill: "start",
        },
        point: {
            radius: 0,
            hitRadius: 0,
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

function generateRandomData(min, max, length) {
    const data = [];
    for (let i = 0; i < length; i++) {
        const randomValue = Math.random() * (max - min) + min;
        data.push(randomValue.toFixed(2)); // Round to 2 decimal places
    }
    return data;
}