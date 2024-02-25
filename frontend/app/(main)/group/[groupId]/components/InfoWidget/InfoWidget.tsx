import React from "react";
import { connect } from "react-redux"
import ContentBox from "@/app/components/contentBox/ContentBox"

import { IRootState } from "@/app/lib/store/store";
import { ChartData, ChartOptions } from "chart.js";
import InfoChart from "@/app/(main)/dashboard/components/InfoWidget/InfoChart";
import { HEXToRGBA } from "@/app/lib/lib/styles"

interface IHeaderWidgetProps {
    title: string,
    value: number,
    changeValue: number,
    data: ChartData<'line'>,
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
                    data={props.data}
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


const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(InfoWidget)

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