'use client'
import React from "react";
// import { Area } from "@ant-design/plots";
import { Api } from "@/app/lib/api/types";
import { Group } from "@/app/(app)/group/[groupId]/types";
import useDashboardStore from "@/app/(app)/dashboard/store";
import { getGroupRecords } from "@/app/(app)/dashboard/actions";
import { TimeframeChoiceEnum } from "@/app/lib/api/types/timeseries.serializers";

const AreaChart = React.lazy(() => import('@ant-design/plots').then(module => ({ default: module.Area })));
const PieChart = React.lazy(() => import('@ant-design/plots').then(module => ({ default: module.Pie })));

interface IGroupsChartsProps { }

const GroupsAreaChart = () => {
    const [data, setData] = React.useState(null);
    const [timeframe, setTimeframe] = React.useState(Api.Timeseries.TimeframeChoiceEnum.DAY);
    const groups = useDashboardStore((state) => state.groups);

    const getTimeRange = React.useCallback((timeframe: Api.Timeseries.TimeframeChoiceEnum): { startTime: Date, endTime: Date } => {
        let endTime = new Date();
        let startTime = new Date();
        // Chose start time based on timeframe
        switch (timeframe) {
            case Api.Timeseries.TimeframeChoiceEnum.MINUTE:
                startTime.setMinutes(endTime.getMinutes() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.HOUR:
                startTime.setHours(endTime.getHours() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.DAY:
                startTime.setDate(endTime.getDate() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.WEEK:
                startTime.setDate(endTime.getDate() - 7);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.MONTH:
                startTime.setMonth(endTime.getMonth() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.YEAR:
                startTime.setFullYear(endTime.getFullYear() - 1);
                break;
        }
        return { startTime, endTime };
    }, [timeframe]);

    const fetchGroupRecordData = React.useCallback(async (group: Group.IGroup) => {
        let { startTime, endTime } = getTimeRange(timeframe);
        // Make request
        const response = await getGroupRecords(group.id, startTime.toISOString(), endTime.toISOString(), TimeframeChoiceEnum.HOUR);
        if (response.error) return []; // TODO: log error
        return response.data.map(record => ({
            ...record,
            time: new Date(record.time).toISOString(),
            group_id: group.id,
            group_name: group.name,
            group_location: group.location,
        }));
    }, [timeframe]);

    const dummyGroupRecordData = React.useCallback((group: Group.IGroup) => {
        let { startTime, endTime } = getTimeRange(timeframe);
        // Compute number of minutes between start and end time
        const minutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
        // Create dummy data
        let value = 0;
        return Array.from({ length: minutes }, (_, i) => {
            const newValue = value * 0.95 + Math.random() * 100 * 0.05;
            value = newValue;
            return {
                time: new Date(startTime.getTime() + i * 60 * 60 * 1000),
                min: newValue * 0.95,
                max: newValue * 1.05,
                value: newValue,
                channel: Math.floor((Math.random() * 10) % 3),
                measure: Math.floor((Math.random() * 10) % 3),
                sensor: Math.floor((Math.random() * 10) % 3),
                group_id: group.id,
                group_name: group.name,
                group_location: group.location,
            }
        })
    }, [timeframe]);

    React.useEffect(() => {
        const fetchData = async () => {
            let data = [];
            await Promise.all(groups.map(async (group) => {
                // const groupData = await fetchGroupData(group);
                const groupData = await dummyGroupRecordData(group);
                data = data.concat(groupData);
            }));
            return data;
        };

        (async () => {
            const data = await fetchData();
            setData(data);
        })();
    }, [timeframe]);

    if (!data) return <h1>Loading...</h1>;
    return (
        <AreaChart
            data={data}
            xField={(d) => new Date(d.time)}
            yField={'value'}
            colorField={'group_name'}
            shapeField={'smooth'}
            stack={true}
            // slider={{ start: data ? data[0]['time'] : null, end: data ? data[data.length - 1]['time'] : null }}
            // slider={data ? { start: data[0]['time'], end: data[data.length - 1]['time'] } : null}
            legend={{
                position: 'top-left',
                flipPage: false,
                flipPageOnClick: false,
            }}
        />
    );
};

const GroupsPieChart: React.FunctionComponent<IGroupsChartsProps> = React.memo(() => {
    const [data, setData] = React.useState(null);
    const { groups } = useDashboardStore((state) => state);

    const fetchGroupValueData = React.useCallback(async (group: Group.IGroup) => {
        // TODO: make request (maybe get for all tanks in group)
    }, []);

    const dummyGroupValueData = React.useCallback((group: Group.IGroup) => {
        return {
            group_id: group.id,
            group_name: group.name,
            group_location: group.location,
            value: Math.random() * 100,
            time: new Date(),
        }
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            let data = [];
            await Promise.all(groups.map(async (group) => {
                // const groupData = await fetchGroupValueData(group);
                const groupData = dummyGroupValueData(group);
                data.push(groupData);
            }));
            return data;
        };

        (async () => {
            const data = await fetchData();
            setData(data);
        })();
    }, []);

    if (!data) return <h1>Loading...</h1>;
    return (
        <PieChart
            data={data}
            angleField="value"
            colorField="group_name"
            radius={0.9}
            innerRadius={0.5}
            label={{
                type: 'inner',
                offset: '-30%',
                content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            }}
            interactions={[
                {
                    type: 'pie-legend-active',
                },
                {
                    type: 'element-active',
                },
            ]}
        />
    );
});

const GroupsCharts: React.FunctionComponent<IGroupsChartsProps> = React.memo(() => {
    return (
        <div id="groups-charts" className="groups-charts">
            <GroupsAreaChart />
            <GroupsPieChart />
        </div >
    );
});

export default GroupsCharts;