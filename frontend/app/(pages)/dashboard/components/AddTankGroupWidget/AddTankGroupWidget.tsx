'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import styles from './styles/AddTankGroupWidget.module.scss';
import ContentBox from '@/app/components/contentBox/ContentBox';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddTankGroupButtonProps extends ReturnType<typeof mapStateToProps> { }

const AddTankGroupButton: React.FunctionComponent<IAddTankGroupButtonProps> = (props: IAddTankGroupButtonProps) => {

    const toggleAddTankGroupMenu = React.useCallback(() => {
        dashboardHandler.setShowCreateTankGroupMenu(true);
    }, []);

    return (
        <ContentBox customBoxClass={styles.main}>
            <div className={styles.content}>
                <button onClick={toggleAddTankGroupMenu} className={styles.button}>
                    <span className={styles.icon}>+</span>
                </button>
            </div>
        </ContentBox>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        showAddTankGroupMenu: state.dashboard.showAddTankGroupMenu
    }
}

export default connect(mapStateToProps, {})(AddTankGroupButton);

