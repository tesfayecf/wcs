'use client'
import React from 'react';
import styles from './styles/AddWaterTankWidget.module.scss';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import { IRootState } from '@/app/utils/store/store';
import { connect } from 'react-redux';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankWidgetProps extends ReturnType<typeof mapStateToProps> { }

const WaterTankAddButton: React.FunctionComponent<IAddWaterTankWidgetProps> = (props: IAddWaterTankWidgetProps) => {

    const toggleAddTankMenu = React.useCallback(() => {
        dashboardHandler.setShowAddTankMenu(!props.showAddTankMenu);
    }, [props.showAddTankMenu]);

    return (
        <div className={styles.main}>
            <div className={styles.main_content}>
                <button onClick={toggleAddTankMenu} className={styles.main_content_button}>
                    <span className={styles.main_content_button_icon}>+</span>
                </button>
            </div>
        </div>
    )
};



const mapStateToProps = (state: IRootState) => {
    return {
        showAddTankMenu: state.dashboard.showAddTankMenu
    }
}

export default connect(mapStateToProps, {})(WaterTankAddButton);

