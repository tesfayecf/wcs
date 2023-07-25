import { IRootState } from '@/app/utils/store/store'
import React from 'react'
import { connect } from 'react-redux'
import TankWidget from '../TankWidget/TankWidget'
import style from './styles/TankLayout.module.scss'

interface ITankLayoutProps extends ReturnType<typeof mapStateToProps> { }


const TanksLayout: React.FunctionComponent<ITankLayoutProps> = (props: ITankLayoutProps) => {

    const renderTanks = React.useCallback(() => {
        return props.tanks.map((tank, index) => {
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
    tanks: state.tanks.tanks
})


export default connect(mapStateToProps, {})(TanksLayout)