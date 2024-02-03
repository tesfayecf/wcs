'use client'
import { IRootState } from '@/app/utils/store/store'
import React from 'react'
import { connect } from 'react-redux'
import TankWidget from '../TankWidget/TankWidget'
import GroupHandler from '../../GroupHandler'

const groupHandler = GroupHandler.getInstance();

interface ITankElementsProps extends ReturnType<typeof mapStateToProps> { }

const TanksInfo: React.FunctionComponent<ITankElementsProps> = (props: ITankElementsProps) => {

    const renderTanksInfo = React.useCallback(() => {
        const widgets = props.tanks.map((tank, index) =>
            <TankWidget tank={tank} key={index} />
        )

        return widgets
    }, [props.tanks])

    return renderTanksInfo()
}

const mapStateToProps = (state: IRootState) => ({
    tanks: state.group.tanks,
    sensors: state.group.sensors
})


export default connect(mapStateToProps, {})(TanksInfo)