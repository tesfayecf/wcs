'use client'
import React, { useState, useEffect, useCallback, useMemo, useTransition } from "react";

import { useDashboardStore } from "@/app/(app)/dashboard/store";
import { Api } from "@/app/lib/api/types";
import { Group } from "@/app/(app)/group/[groupId]/types";
import { DashboardRecordsManager as Manager } from "@/app/(app)/dashboard/manager";
import { Area } from "@ant-design/plots";

// const AreaChart = React.lazy(() => import('@ant-design/plots').then(module => ({ default: module.Area })));

interface IGroupsAreaChartProps {}

const GroupsAreaChart: React.FunctionComponent<IGroupsAreaChartProps> = React.memo(() => {
    const [data, setData] = useState(null);
    const [period, setPeriod] = useState(Api.Timeseries.TimeframeChoiceEnum.WEEK);
    const [timeframe, setTimeframe] = useState(Api.Timeseries.TimeframeChoiceEnum.HOUR);
    const [isPending, startTransition] = useTransition();
    const groups = useDashboardStore((state) => state.groups);
    const manager = useMemo(() => new Manager(), []);

    useEffect(() => {
        // If no groups, do nothing
        if (groups.length === 0) return;

        console.log(`Fetching data for group ${groups[0].id} - ${period} - ${timeframe}`);

        // Fetch data
        startTransition(async () => {
            const periodObj = Manager.getTimeRange(period);
            const data = await manager.fetchGroupRecords(groups[0], periodObj, timeframe);
            setData(data);
        });
    }, [groups, timeframe]);

    const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newTimeframe = event.target.value as Api.Timeseries.TimeframeChoiceEnum;
        setTimeframe(newTimeframe);
    };

    const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = event.target.value as Api.Timeseries.TimeframeChoiceEnum;
        setPeriod(newPeriod);
    };

    if (!data) return <h1>Loading Area chart...</h1>;
    return (
        <div>
            {isPending ? <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", padding: "auto" }}>
                <h2>LAODING DATA</h2>
            </div> : null}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <select value={timeframe} onChange={handleTimeframeChange}>
                    {Object.values(Api.Timeseries.TimeframeChoiceEnum).map((tf) => (
                        <option key={tf} value={tf}>{tf}</option>
                    ))}
                </select>
                <select value={period} onChange={handlePeriodChange}>
                    {Object.values(Api.Timeseries.TimeframeChoiceEnum).map((tf) => (
                        <option key={tf} value={tf}>{tf}</option>
                    ))}
                </select>
            </div>
            <React.Suspense fallback={<h1>Loading Area chart...</h1>}>
                <Area
                    data={data}
                    // loading={isPending}
                    xField={(d) => new Date(d.time)}
                    yField={'value'}
                    colorField={'group_name'}
                    shapeField={'smooth'}
                    stack={true}
                    legend={{
                        position: 'top-left',
                        flipPage: false,
                        flipPageOnClick: false,
                    }}
                />
            </React.Suspense>
        </div>
    );
});

export default GroupsAreaChart;