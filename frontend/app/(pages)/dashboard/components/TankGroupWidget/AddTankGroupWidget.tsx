'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import styles from './styles/AddTankGroupWidget.module.scss';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddTankGroupButtonProps extends ReturnType<typeof mapStateToProps> { }

const AddTankGroupButton: React.FunctionComponent<IAddTankGroupButtonProps> = (props: IAddTankGroupButtonProps) => {

    const toggleAddTankGroupMenu = React.useCallback(() => {
        dashboardHandler.setShowCreateTankGroupMenu(!props.showAddTankMenu);
    }, [props.showAddTankMenu]);

    return (
        <div className={styles.main}>
            <div className={styles.main_content}>
                <button onClick={toggleAddTankGroupMenu} className={styles.main_content_button}>
                    <span className={styles.main_content_button_icon}>+</span>
                </button>
            </div>
        </div>
    )
};



const mapStateToProps = (state: IRootState) => {
    return {
        showAddTankMenu: state.dashboard.showAddTankGroupMenu
    }
}

export default connect(mapStateToProps, {})(AddTankGroupButton);

