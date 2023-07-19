'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import PopUpFormTemplate from '@/app/components/popUp/PopUpFormTemplate';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const AddWaterTankGroupPopUp: React.FunctionComponent<IAddWaterTankPopUpProps> = (props: IAddWaterTankPopUpProps) => {


    const onClose = () => {
        dashboardHandler.setShowCreateTankGroupMenu(false);
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankGroupCreationFormName(event.target.value);
    }

    const onLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankGroupCreationFormLocation(event.target.value);
    }

    const onCreate = () => {
        dashboardHandler.createTankGroup();
    }

    return (
        <>
            <PopUpFormTemplate
                title="Add Tank Group"
                open={props.showAddTankGroupMenu}
                onCancel={onClose}
                onSubmit={onCreate}
                // disableSubmit={!props.tankGroupCreationForm.name || !props.tankGroupCreationForm.location}
                submitButtonText="Add"
                onCancelButtonText="Cancel"
                fields={[
                    {
                        name: "Name",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankGroupCreationForm.name,
                        onChange: onNameChange,
                        error: props.tankGroupCreationForm.nameError,
                    },
                    {
                        name: "Location",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankGroupCreationForm.location,
                        onChange: onLocationChange,
                        error: props.tankGroupCreationForm.locationError,
                    },
                ]}
            />
        </>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        tankGroupCreationForm: state.dashboard.tankGroupCreationForm,
        showAddTankGroupMenu: state.dashboard.showAddTankGroupMenu
    }
}

export default connect(mapStateToProps, {})(AddWaterTankGroupPopUp);


