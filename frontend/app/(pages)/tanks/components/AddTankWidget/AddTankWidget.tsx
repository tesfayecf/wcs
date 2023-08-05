'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import styles from './styles/AddTankWidget.module.scss';
import ContentBox from '@/app/components/contentBox/ContentBox';
import TanksHandler from '../../TanksHandler';
const tanksHandler = TanksHandler.getInstance();

interface IAddWaterTankWidgetProps extends ReturnType<typeof mapStateToProps> { }

const AddTankWidget: React.FunctionComponent<IAddWaterTankWidgetProps> = (props: IAddWaterTankWidgetProps) => {

    const toggleAddTankMenu = React.useCallback(() => {
        tanksHandler.setShowAddTankMenu(true)
    }, []);

    return (
        <ContentBox customBoxClass={styles.main}>
            <div className={styles.content}>
                <button onClick={toggleAddTankMenu} className={styles.button}>
                    <span className={styles.icon}>+</span>
                </button>
            </div>
        </ContentBox>
    )
};



const mapStateToProps = (state: IRootState) => {
    return {
    }
}

export default connect(mapStateToProps, {})(AddTankWidget);

