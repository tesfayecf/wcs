'use client'
import React from 'react';
import { useStore } from '@/app/store/store';
import styles from './styles/AddWaterTankWidget.module.scss';
import DashboardHandler from '../../DashboardHandler';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankWidgetProps {

}

const WaterTankAddButton: React.FunctionComponent<IAddWaterTankWidgetProps> = (props: IAddWaterTankWidgetProps) => {

    console.log(useStore().DashboardStore.store);
    const showAddTankMenu = useStore().DashboardStore.store.showAddTankMenu;

    const toggleAddTankMenu = React.useCallback(() => {
        dashboardHandler.setShowAddTankMenu(!showAddTankMenu);
    }, [showAddTankMenu]);

    return (
        <div className={styles.main}>
            <div className={styles.main_content}>
                <button onClick={toggleAddTankMenu} className={styles.main_content_button}>
                    <span className={styles.main_content_button_icon}>+</span>
                    {showAddTankMenu ? <h2 className={styles.main_content_button_text}>ADD WATER TANK</h2> : null}
                </button>
            </div>
        </div>
    )
};


export default WaterTankAddButton;

