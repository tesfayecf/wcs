'use client'
import React from "react";
import { Spin } from 'antd';
import { Area } from "@ant-design/plots";
import { useDashboardStore } from "@/app/(app)/dashboard/store";
import { ChartManager, PeriodEnum, ChartEvents, GroupChartConfig, GroupChartRecord, TimeRange } from "@/app/lib/managers/ChartManager";
import { getGroupRecords } from "@/app/(app)/dashboard/actions";
import ChartFilters, { ChartOptions, TIME_OPTIONS } from "./GroupChartFilters";

interface IGroupsAreaChartProps { }

const GroupsAreaChart: React.FC = () => {
    const manager = React.useMemo(() => new ChartManager<GroupChartConfig, GroupChartRecord>(), []);
    const groups = useDashboardStore((state) => state.groups);

    const [data, setData] = React.useState<GroupChartRecord[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [isStacked, setIsStacked] = React.useState(true);
    const [selectedGroups, setSelectedGroups] = React.useState<number[]>([]);
    const [timeOption, setTimeOption] = React.useState<ChartOptions>(TIME_OPTIONS[2]);

    const fetchData = React.useCallback(async (config: GroupChartConfig): Promise<GroupChartRecord[]> => {
        const timeRange = getTimeRange(config.period, config.customRange);
        const response = await getGroupRecords(
            config.groupId,
            timeRange.startTime.toISOString(),
            timeRange.endTime.toISOString(),
            config.timeframe
        );

        if (response.error) throw new Error(response.error);

        return response.data.map(record => ({
            ...record,
            time: new Date(record.time).toISOString(),
            group_id: config.groupId,
            group_name: config.groupName,
        }));
    }, []);

    // Event handlers setup
    React.useEffect(() => {
        const handleLoading = () => setLoading(true);
        const handleLoaded = (records: GroupChartRecord[]) => {
            setLoading(false);
            setData([...data].concat(records));
        };
        const handleError = (error: Error) => {
            setLoading(false);
            console.error('Chart error:', error);
        };

        manager.addListener(ChartEvents.LOADING, handleLoading);
        manager.addListener(ChartEvents.LOADED, handleLoaded);
        manager.addListener(ChartEvents.ERROR, handleError);

        return () => {
            manager.removeListener(ChartEvents.LOADING, handleLoading);
            manager.removeListener(ChartEvents.LOADED, handleLoaded);
            manager.removeListener(ChartEvents.ERROR, handleError);
        };
    }, [manager]);

    // Data fetching effect
    React.useEffect(() => {
        if (selectedGroups.length === 0) return;

        const fetchGroupData = async () => {
            try {
                const promises = selectedGroups.map(groupId => {
                    const group = groups.find(g => g.id === groupId);
                    if (!group) return null;

                    const config: GroupChartConfig = {
                        groupId: group.id,
                        groupName: group.name,
                        timeframe: timeOption.timeframe,
                        period: timeOption.period,
                    };

                    return manager.updateData(config, fetchData);
                });

                await Promise.all(promises.filter(Boolean));
            } catch (error) {
                console.error('Failed to update chart:', error);
            }
        };

        fetchGroupData();
    }, [selectedGroups, timeOption, manager, groups, fetchData]);

    // Initialize selected groups
    React.useEffect(() => {
        if (groups.length > 0 && selectedGroups.length === 0) {
            setSelectedGroups([groups[0].id]);
        }
    }, [groups, selectedGroups]);

    if (loading && !data.length) {
        return <h1>Loading Area chart...</h1>;
    }

    const onGroupsChange = (groupIds: number[]) => {
        setSelectedGroups(groupIds);
    };

    return (
        <div className="chart-container">
            <ChartFilters
                selectedGroups={selectedGroups}
                isStacked={isStacked}
                selectedTimeOption={timeOption}
                onGroupsChange={onGroupsChange}
                onStackedChange={setIsStacked}
                onTimeOptionChange={setTimeOption}
                availableGroups={groups.map(group => ({ id: group.id, name: group.name }))}
            />

            <div className="chart">
                {loading && (<Spin />)}
                <Area
                    data={data}
                    xField="time"
                    yField="value"
                    colorField="group_name"
                    shapeField="smooth"
                    stack={isStacked}
                    legend={{
                        position: 'top-left',
                        flipPage: false,
                    }}
                />
            </div>
        </div>
    );
};

export default GroupsAreaChart;

// Helper function for time range calculation
const getTimeRange = (period: PeriodEnum, customRange?: TimeRange): TimeRange => {
    if (customRange && period === PeriodEnum.CUSTOM) {
        return customRange;
    }

    const endTime = new Date();
    const startTime = new Date();

    const periodMapping = {
        [PeriodEnum.LAST_HOUR]: () => startTime.setHours(endTime.getHours() - 1),
        [PeriodEnum.LAST_DAY]: () => startTime.setDate(endTime.getDate() - 1),
        [PeriodEnum.LAST_WEEK]: () => startTime.setDate(endTime.getDate() - 7),
        [PeriodEnum.LAST_MONTH]: () => startTime.setMonth(endTime.getMonth() - 1),
        [PeriodEnum.LAST_YEAR]: () => startTime.setFullYear(endTime.getFullYear() - 1),
    };

    periodMapping[period]?.();
    return { startTime, endTime };
};