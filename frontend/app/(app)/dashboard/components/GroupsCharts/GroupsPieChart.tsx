'use client'
import React from "react";
import { Group } from "@/app/(app)/group/[groupId]/types";
import { useDashboardStore } from "@/app/(app)/dashboard/store";

const PieChart = React.lazy(() => import('@ant-design/plots').then(module => ({ default: module.Pie })));

interface IGroupsPieChartsProps {}

const GroupsPieChart: React.FunctionComponent<IGroupsPieChartsProps> = React.memo(() => {
    const [data, setData] = React.useState(null);
    const { groups } = useDashboardStore((state) => state);

    React.useEffect(() => {
        fetchData();
    }, []);

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

    const fetchData = React.useCallback(async () => {
        let data = [];
        await Promise.all(groups.map(async (group) => {
            // const groupData = await fetchGroupValueData(group);
            const groupData = dummyGroupValueData(group);
            data.push(groupData);
        }));

        setData(data);
    }, [groups]);

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

export default GroupsPieChart;