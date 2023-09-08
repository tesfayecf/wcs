'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const AddTankGroupPopUp: React.FunctionComponent<IAddWaterTankPopUpProps> = (props: IAddWaterTankPopUpProps) => {


    const onClose = () => {
        dashboardHandler.setShowCreateTankGroupMenu(false);
        dashboardHandler.setTankGroupCreationForm({
            name: "",
            nameError: false,
            location: "",
            locationError: false,
            description: "",
            descriptionError: false,
        })
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankGroupCreationFormName(event.target.value);
    }

    const onLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankGroupCreationFormLocation(event.target.value);
    }

    const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankGroupCreationFormDescription(event.target.value);
    }

    const onCreate = () => {
        dashboardHandler.createTankGroup();
    }

    return (
        <>
            <FormTemplate
                title="Add Tank Group"
                externalError={false}
                externalErrorText={""}
                onCancel={onClose}
                onAccept={onCreate}
                submitButtonText="Add"
                cancelButtonText="Cancel"
                fields={[
                    {
                        name: "Name",
                        type: "text",
                        placeholder: "",
                        value: props.tankGroupCreationForm.name,
                        onChange: onNameChange,
                        error: props.tankGroupCreationForm.nameError,
                    },
                    {
                        name: "Location",
                        type: "text",
                        placeholder: "",
                        value: props.tankGroupCreationForm.location,
                        onChange: onLocationChange,
                        error: props.tankGroupCreationForm.locationError,
                    },
                    {
                        name: "Description",
                        type: "multitext",
                        placeholder: "",
                        value: props.tankGroupCreationForm.description,
                        onChange: onDescriptionChange,
                        error: false,
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

export default connect(mapStateToProps, {})(AddTankGroupPopUp);


