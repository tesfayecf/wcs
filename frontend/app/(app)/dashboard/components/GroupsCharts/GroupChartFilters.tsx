'use client'
import React from "react";
import { Segmented, Select, Switch } from "antd";
import { PeriodEnum } from "@/app/lib/managers/ChartManager";
import { TimeframeChoiceEnum } from "@/app/lib/api/types/timeseries.serializers";

// Types
export interface ChartOptions {
    label: string;
    period: PeriodEnum;
    timeframe: TimeframeChoiceEnum;
    disabled?: boolean
}

interface ChartFiltersProps {
    selectedGroups: number[];
    isStacked: boolean;
    selectedTimeOption: ChartOptions;
    onGroupsChange: (groupIds: number[]) => void;
    onStackedChange: (stacked: boolean) => void;
    onTimeOptionChange: (option: ChartOptions) => void;
    availableGroups: Array<{ id: number; name: string; }>;
}

// Filters Component
const ChartFilters: React.FC<ChartFiltersProps> = (props: ChartFiltersProps) => {
    return (
        <div className="chart-filters">
            <Select
                mode="multiple"
                value={props.selectedGroups.map(group => group)}
                style={{ minWidth: "200px" }}
                placeholder="Select groups"
                maxTagCount="responsive"
                onChange={props.onGroupsChange}
                options={props.availableGroups.map(group => ({
                    label: group.name,
                    value: group.id
                }))}
            />

            <Switch
                checked={props.isStacked}
                onChange={props.onStackedChange}
                checkedChildren="Stacked"
                unCheckedChildren="Unstacked"
            />

            <Segmented
                value={props.selectedTimeOption}
                onChange={props.onTimeOptionChange}
                className="timeframe"
                options={TIME_OPTIONS.map((option) => ({
                    value: option,
                    label: option.label,
                    className: "timeframe-item",
                    disabled: option.disabled
                }))}
            />
        </div>
    );
};

export default ChartFilters;

// Chart configuration constants
export const TIME_OPTIONS: ChartOptions[] = [
    { label: "1H", period: PeriodEnum.LAST_HOUR, timeframe: TimeframeChoiceEnum["1_MINUTE"] },
    { label: "1D", period: PeriodEnum.LAST_DAY, timeframe: TimeframeChoiceEnum["1_HOUR"] },
    { label: "1W", period: PeriodEnum.LAST_WEEK, timeframe: TimeframeChoiceEnum["3_HOURS"] },
    { label: "1M", period: PeriodEnum.LAST_MONTH, timeframe: TimeframeChoiceEnum["1_DAY"] },
    { label: "3M", period: PeriodEnum.LAST_MONTH, timeframe: TimeframeChoiceEnum["3_DAYS"] },
    { label: "1Y", period: PeriodEnum.LAST_YEAR, timeframe: TimeframeChoiceEnum["1_MONTH"] },
    { label: "All", period: PeriodEnum.ALL, timeframe: TimeframeChoiceEnum["1_MONTH"], disabled: true }
];