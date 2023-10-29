import React from 'react'
import { ChartData } from 'chart.js'
import { connect } from 'react-redux'
import HeaderWidget from '@/app/components/header/HeaderWidget'
import { IRootState } from '@/app/utils/store/store'


interface IHeaderProps extends ReturnType<typeof mapStateToProps> { }

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
    return (
        <div id="header" className={"header"}>
            <HeaderWidget title='Inflow' value={241.24} changeValue={23} data={data1} color='#3de198' />
            <HeaderWidget title='Outflow' value={872.27} changeValue={-5} data={data2} color='#e07159' />
            <HeaderWidget title='Savings' value={35} changeValue={5} data={data3} color='#f2c986' />
        </div>
    )
}

const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(Header)


// Define the labels
const labels = [
    "1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d",
    "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"
];

const data1: ChartData<'line'> = {
    labels: labels,
    datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

const data2: ChartData<'line'> = {
    labels: labels,
    datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

const data3: ChartData<'line'> = {
    labels: labels,
    datasets: [{ data: generateRandomData(0, 1, labels.length), }]
}

function generateRandomData(min, max, length) {
    const data = [];
    for (let i = 0; i < length; i++) {
        const randomValue = Math.random() * (max - min) + min;
        data.push(randomValue.toFixed(2)); // Round to 2 decimal places
    }
    return data;
}