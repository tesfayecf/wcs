'use client'
import React from 'react'
import { connect } from 'react-redux'
import { IRootState } from '@/app/utils/store/store'
import TankWidget from '@/app/(pages)/group/[groupId]/components/TankWidget/TankWidget'

interface ITankElementsProps extends ReturnType<typeof mapStateToProps> { }

const TanksInfo: React.FunctionComponent<ITankElementsProps> = (props: ITankElementsProps) => {

    const renderTanksInfo = React.useCallback(() => {
        const widgets = props.tanks.map((tank, index) =>
            <TankWidget tank={tank} key={index} />
        )

        return widgets;
    }, [props.tanks])

    return renderTanksInfo()
}

const mapStateToProps = (state: IRootState) => ({
    tanks: state.group.tanks,
    sensors: state.group.sensors
})


export default connect(mapStateToProps, {})(TanksInfo)