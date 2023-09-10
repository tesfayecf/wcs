'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';
import PopUpTemplate from '@/app/components/popUpTemplate/PopUpTemplate';
import { ITankGroupCreationFormN } from '../../DashboardTypes';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const AddTankGroupPopUp: React.FunctionComponent<IAddWaterTankPopUpProps> = (props: IAddWaterTankPopUpProps) => {

    const onClose = (ev: any) => {
        dashboardHandler.setShowCreateTankGroupMenu(false);
    }

    const onCreate = async (fields: ITankGroupCreationFormN) => {
        await dashboardHandler.createTankGroup(fields);
    }

    return (
        <PopUpTemplate
            open={props.showAddTankGroupMenu}
            onClose={onClose}
        >
            <FormTemplate<ITankGroupCreationFormN>
                title="Create Tank Group"
                externalError={false}
                externalErrorText={"Invalid data"}
                onCancel={onClose}
                onAccept={onCreate}
                acceptButtonText="Create"
                cancelButtonText="Cancel"
                hideCancelButton={false}
                isLoading={props.isFormLoading}
                fields={[
                    {
                        name: "Name",
                        type: "text",
                        placeholder: "",
                    },
                    {
                        name: "Location",
                        type: "text",
                        placeholder: "",
                        // textType: "location"
                    },
                    {
                        name: "Description",
                        type: "multitext",
                        placeholder: "",
                        rows: 3,
                    },
                ]}
            />
        </PopUpTemplate>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        tankGroupCreationForm: state.dashboard.tankGroupCreationForm,
        showAddTankGroupMenu: state.dashboard.showAddTankGroupMenu,
        isFormLoading: state.app.loading.isFormLoading,
    }
}

export default connect(mapStateToProps, {})(AddTankGroupPopUp);


