'use client'
import React from "react";
import ContentBox from "@/app/components/contentBox/ContentBox";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartData, ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { HEXToRGBA } from "@/app/lib/utils/styles";

ChartJS.register(CategoryScale, LinearScale, PointElement,
    LineElement, Title, Legend, Tooltip, Filler
);

interface IHeaderWidgetProps {
    title: string;
    data: number[];
    color: string;
    unit: string;
    timeframe: "s" | "m" | "h" | "d" | "mo";
}

const InfoWidget: React.FunctionComponent<IHeaderWidgetProps> = (props: IHeaderWidgetProps) => {
    const renderTextData = React.useCallback(() => {
        let direction: string;
        let color: string;
        let timeframe: string;

        if (props.timeframe === "s") timeframe = "second";
        else if (props.timeframe === "m") timeframe = "minute";
        else if (props.timeframe === "h") timeframe = "hour";
        else if (props.timeframe === "d") timeframe = "day";
        else if (props.timeframe === "mo") timeframe = "month";
        else timeframe = "";

        const lastValue = props.data.length > 0 ? props.data[props.data.length - 1] : 0;
        const prevValue = props.data.length > 1 ? props.data[props.data.length - 2] : 0;
        const changeValue = prevValue !== 0 ? Math.round(((lastValue - prevValue) / prevValue) * 100) : 0;

        if (changeValue > 0) {
            direction = '↑';
            color = '#3de198'; // $graph-color-1
        } else {
            direction = '↓';
            color = '#e07159'; // $graph-color-4
        }

        return (
            <div className={"text"}>
                <span className={"title"}>{props.title}</span>
                <span className={"value"}>{lastValue} {props.unit}</span>
                <div className={"change"}>
                    <span className={"change-value"} style={{ color: color }}>{changeValue}% {direction}</span>
                    <span className={"change-text"}>than last {timeframe}</span>
                </div>
            </div>
        );
    }, [props.title, props.data]);

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
                        return gradient;
                    },
                },
            },
        };
        return customOptions;
    }, [props.color]);

    const filledData = React.useMemo(() => {
        const labelsCount = labels.length;
        if (props.data.length >= labelsCount) {
            return props.data.slice(-labelsCount);
        }
        const zerosToAdd = Array(labelsCount - props.data.length).fill(0);
        return [...zerosToAdd, ...props.data];
    }, [props.data]);

    return (
        <ContentBox customBoxClass={"infoWidget"} >
            <div className={"infoWidgetContent"}>
                {renderTextData()}
                <InfoChart
                    data={{ labels, datasets: [{ data: filledData }] }}
                    options={getCustomOptions(
                        HEXToRGBA(props.color, 0.9),
                        HEXToRGBA(props.color, 0.01)
                    )}
                />
            </div>
        </ContentBox>
    );
};

export default InfoWidget;

interface IheaderChartProps {
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
}

const InfoChart: React.FunctionComponent<IheaderChartProps> = (props: IheaderChartProps) => {

    return (
        <div className={"line-chart"} >
            <Line id={"infoChart"} data={props.data} options={props.options} width={"100%"} />
        </div>
    )
}

const labels = [
    "1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d",
    "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"
];

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
