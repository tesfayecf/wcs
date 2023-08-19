import React from 'react'
import { connect } from 'react-redux'
import styles from './styles/Header.module.scss'
import { IRootState } from '@/app/utils/store/store'
import HeaderWidget from './HeaderWidget'
import { ChartData } from 'chart.js'


interface IHeaderProps extends ReturnType<typeof mapStateToProps> { }

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
    return (
        <div id="header" className={styles.header}>
            <HeaderWidget title='Inflow' value={241.24} changeValue={23} data={data1} color='#77c4a9' />
            <HeaderWidget title='Outflow' value={872.27} changeValue={-5} data={data2} color='#fae499' />
            <HeaderWidget title='Savings' value={35} changeValue={5} data={data3} color='#789abd' />
        </div>
    )
}

const mapStateToProps = (state: IRootState) => {
    return {}
}

export default connect(mapStateToProps, {})(Header)

const data1: ChartData<'line'> = {
    labels: ["1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d", "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"],
    datasets: [
        {
            data: [0.45, 0.65, 0.55, 0.35, 0.15, 0.25, 0.45, 0.65, 0.85, 0.95, 0.75, 0.55, 0.35, 0.55, 0.45, 0.55, 0.75, 0.85, 0.85, 0.75, 0.65],
        }
    ]
}

const data2: ChartData<'line'> = {
    labels: ["1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d", "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"],
    datasets: [
        {
            data: [0.45, 0.65, 0.55, 0.35, 0.15, 0.25, 0.45, 0.65, 0.85, 0.95, 0.75, 0.55, 0.35, 0.55, 0.45, 0.55, 0.75, 0.85, 0.85, 0.75, 0.65],
        }
    ]
}

const data3: ChartData<'line'> = {
    labels: ["1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d", "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "20d"],
    datasets: [
        {
            data: [0.45, 0.65, 0.55, 0.35, 0.15, 0.25, 0.45, 0.65, 0.85, 0.95, 0.75, 0.55, 0.35, 0.55, 0.45, 0.55, 0.75, 0.85, 0.85, 0.75, 0.65],
        }
    ]
}