'use client'
import React, { Suspense } from "react";

interface IGroupsChartsProps { }

const fetchData = async () => {
    const response = await fetch('https://assets.antv.antgroup.com/g2/unemployment-by-industry.json');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
};

const AreaChart = React.lazy(() => import('@ant-design/plots').then(module => ({ default: module.Area })));

const ChartContent = () => {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetchData().then(setData);
    }, []);

    if (!data) return null;

    return (
        <AreaChart
            data={data}
            xField={(d) => new Date(d.date)}
            yField={'unemployed'}
            colorField={'industry'}
            shapeField={'smooth'}
            stack={true}
            slider={{ start: data[0]['date'], end: data[data.length - 1]['date'] }}
            legend={{
                position: 'top-left',
                flipPage: false,
                flipPageOnClick: false,
            }}
        />
    );
};

const GroupsCharts: React.FunctionComponent<IGroupsChartsProps> = React.memo(() => {
    return (
        <div id="groups-charts" className="groups-charts">
            <Suspense fallback={<div>Loading...</div>}>
                <ChartContent />
            </Suspense>
        </div>
    );
});

export default GroupsCharts;