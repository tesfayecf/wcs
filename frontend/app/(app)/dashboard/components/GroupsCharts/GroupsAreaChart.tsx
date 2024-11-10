'use client'
import React from "react";
import { Area } from "@ant-design/plots";
import { DatePicker, Divider, Segmented, Select, Spin } from 'antd';
import { useDashboardStore } from "@/app/(app)/dashboard/store";
import { ChartManager, PeriodEnum, ChartEvents, GroupChartConfig, GroupChartRecord, TimeRange } from "@/app/lib/managers/ChartManager";
import { TimeframeChoiceEnum } from "@/app/lib/api/types/timeseries.serializers";
import { getGroupRecords } from "@/app/(app)/dashboard/actions";

interface IGroupsAreaChartProps { }

const GroupsAreaChart: React.FunctionComponent<IGroupsAreaChartProps> = React.memo(() => {
    const manager = React.useMemo(() => new ChartManager<GroupChartConfig, GroupChartRecord>(), []);
    const groups = useDashboardStore((state) => state.groups);
    const [data, setData] = React.useState<GroupChartRecord[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [period, setPeriod] = React.useState(PeriodEnum.LAST_WEEK);
    const [timeframe, setTimeframe] = React.useState(TimeframeChoiceEnum["1_HOUR"]);

    // Helper function to get time range based on period
    const getTimeRange = (period: PeriodEnum, customRange?: TimeRange): TimeRange => {
        if (customRange && period === PeriodEnum.CUSTOM) {
            return customRange;
        }

        const endTime = new Date();
        const startTime = new Date();

        switch (period) {
            case PeriodEnum.LAST_HOUR:
                startTime.setHours(endTime.getHours() - 1);
                break;
            case PeriodEnum.LAST_DAY:
                startTime.setDate(endTime.getDate() - 1);
                break;
            case PeriodEnum.LAST_WEEK:
                startTime.setDate(endTime.getDate() - 7);
                break;
            case PeriodEnum.LAST_MONTH:
                startTime.setMonth(endTime.getMonth() - 1);
                break;
            case PeriodEnum.LAST_YEAR:
                startTime.setFullYear(endTime.getFullYear() - 1);
                break;
        }

        return { startTime, endTime };
    };

    // Data fetching function
    const fetchGroupData = async (config: GroupChartConfig): Promise<GroupChartRecord[]> => {
        const timeRange = getTimeRange(config.period, config.customRange);
        const response = await getGroupRecords(
            config.groupId,
            timeRange.startTime.toISOString(),
            timeRange.endTime.toISOString(),
            config.timeframe
        );

        if (response.error) {
            throw new Error(response.error);
        }

        return response.data.map(record => ({
            ...record,
            time: new Date(record.time).toISOString(),
            group_id: config.groupId,
            group_name: config.groupName,
            tank_id: config.tankId,
        }));
    };

    React.useEffect(() => {
        const handleLoading = () => setLoading(true);
        const handleLoaded = (records: GroupChartRecord[]) => {
            setLoading(false);
            setData(records);
        };
        const handleError = (error: Error) => {
            setLoading(false);
            console.error('Chart error:', error);
        };

        manager.on(ChartEvents.LOADING, handleLoading);
        manager.on(ChartEvents.LOADED, handleLoaded);
        manager.on(ChartEvents.ERROR, handleError);

        return () => {
            manager.off(ChartEvents.LOADING, handleLoading);
            manager.off(ChartEvents.LOADED, handleLoaded);
            manager.off(ChartEvents.ERROR, handleError);
        };
    }, [manager]);

    React.useEffect(() => {
        if (groups.length === 0) return;

        console.log(`Updating chart for group ${groups[0].id} - ${period} - ${timeframe}`);

        const config: GroupChartConfig = {
            groupId: groups[0].id,
            groupName: groups[0].name,
            timeframe,
            period,
        };

        manager.updateData(config, fetchGroupData).catch(error => {
            console.error('Failed to update chart:', error);
        });
    }, [groups, period, timeframe, manager]);

    const handleTimeframeChange = (newTimeframe: TimeframeChoiceEnum) => {
        setTimeframe(newTimeframe);
    };

    const handlePeriodChange = (newPeriod: PeriodEnum) => {
        setPeriod(newPeriod);
    };

    const handleDateRangeChange = (dates: [Date, Date] | null) => {
        if (!dates || !groups.length) return;

        const [startTime, endTime] = dates;

        const config = {
            groupId: groups[0].id,
            groupName: groups[0].name,
            timeframe,
            period: PeriodEnum.CUSTOM,
            customRange: { startTime, endTime },
        }

        manager.updateData(config, fetchGroupData).catch(error => {
            console.error('Failed to update chart:', error);
        });
    };

    if (loading && !data.length) {
        return <h1>Loading Area chart...</h1>;
    }

    return (
        <div className="chart-container">
            <div className="filters">
                <Segmented
                    value={timeframe}
                    onChange={handleTimeframeChange}
                    className="timeframe"
                    vertical={false}
                    options={Object.values(TimeframeChoiceEnum).map((tf) => ({
                        label: tf.replace(/(\d+)([a-z]+)/, '$1$2'),
                        value: tf,
                        disabled: false,
                        className: "timeframe-item",
                    }))}
                />
                <Select
                    value={period}
                    onChange={handlePeriodChange}
                    className="period"
                    options={Object.values(PeriodEnum)
                        .filter(p => p !== PeriodEnum.CUSTOM)
                        .map((p) => ({
                            label: p.split('_').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' '),
                            value: p,
                            className: "period-item",
                        }))}
                    dropdownRender={(menu) => (
                        <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <DatePicker.RangePicker
                                onChange={(_, dateStrings) => {
                                    if (dateStrings[0] && dateStrings[1]) {
                                        handleDateRangeChange([
                                            new Date(dateStrings[0]),
                                            new Date(dateStrings[1])
                                        ]);
                                    }
                                }}
                                allowEmpty={[false, false]}
                                required
                            />
                        </>
                    )}
                />
            </div>
            <div className="chart">
                <Spin spinning={loading} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <React.Suspense fallback={<h1>Loading Area chart...</h1>}>
                    <Area
                        data={data}
                        // loading={loading}
                        xField={(d) => new Date(d.time)}
                        yField="value"
                        colorField="group_name"
                        shapeField="smooth"
                        stack={true}
                        legend={{
                            position: 'top-left',
                            flipPage: false,
                            flipPageOnClick: false,
                        }}
                    />
                </React.Suspense>
            </div>
        </div>
    );
});

export default GroupsAreaChart;