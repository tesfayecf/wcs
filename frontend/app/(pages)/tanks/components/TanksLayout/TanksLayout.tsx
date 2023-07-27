import { IRootState } from '@/app/utils/store/store'
import React from 'react'
import { connect } from 'react-redux'
import TankWidget from '../TankWidget/TankWidget'
import style from './styles/TankLayout.module.scss'
import TanksHandler from '../../TanksHandler'

const tanksHandler = TanksHandler.getInstance();

interface ITankLayoutProps extends ReturnType<typeof mapStateToProps> { }


const TanksLayout: React.FunctionComponent<ITankLayoutProps> = (props: ITankLayoutProps) => {

    const renderTanks = React.useCallback(() => {
        if (!props.tanks) {
            return null
        }

        if (props.tanks.length === 0) {
            return (
                <div className={style.empty}>
                    <span>No tanks yet</span>
                </div>
            )
        }

        return props.tanks.map((tank, index) => {
            console.log(tank)
            tanksHandler.getTankSensor(tank.id);
            const sensor = props.sensors.find(s => s.tank.id === tank.id);
            return (
                <TankWidget tank={tank} key={index} />
            )
        })

    }, [props.tanks])

    return (
        <div className={style.tanks}>
            {renderTanks()}
        </div>
    )
}

const mapStateToProps = (state: IRootState) => ({
    tanks: state.tanks.tanks,
    sensors: state.tanks.sensors
})


export default connect(mapStateToProps, {})(TanksLayout)