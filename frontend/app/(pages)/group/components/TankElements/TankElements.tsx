import { IRootState } from '@/app/utils/store/store'
import React from 'react'
import { connect } from 'react-redux'
import TankWidget from '../TankWidget/TankWidget'
import GroupHandler from '../../GroupHandler'

const groupHandler = GroupHandler.getInstance();

interface ITankElementsProps extends ReturnType<typeof mapStateToProps> { }


const TankElements: React.FunctionComponent<ITankElementsProps> = (props: ITankElementsProps) => {

    const renderTanks = React.useCallback(() => {

        if (props.tanks.length === 0 || !props.tanks) {
            return (
                <div className={"empty"}>
                    <span className={"emptyText"}>NO TANKS CREATED</span>
                </div>
            )
        }

        return props.tanks.map((tank, index) => {
            // groupHandler.getSensor(tank.id);
            // const sensor = props.sensors.find(s => s.tank.id === tank.id);
            return (
                <TankWidget tank={tank} key={index} />
            )
        })

    }, [props.tanks])

    return (
        <div id={"tankElements"} className={props.tanks.length === 0 || !props.tanks ? `${"tankElementsEmpty"}` : `${"tankElements"}`}>
            {renderTanks()}
        </div>
    )
}

const mapStateToProps = (state: IRootState) => ({
    tanks: state.group.tanks,
    sensors: state.group.sensors
})


export default connect(mapStateToProps, {})(TankElements)