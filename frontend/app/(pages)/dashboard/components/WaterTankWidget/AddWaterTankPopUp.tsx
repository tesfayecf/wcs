'use client'
import React from 'react';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import { SelectChangeEvent } from '@mui/material';
import PopUpFormTemplate from '@/app/components/popUp/PopUpFormTemplate';
import { IRootState } from '@/app/utils/store/store';
import { connect } from 'react-redux';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const AddWaterTankPopUp: React.FunctionComponent<IAddWaterTankPopUpProps> = (props: IAddWaterTankPopUpProps) => {


    const onClose = () => {
        dashboardHandler.setShowAddTankMenu(false);
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationFormName(event.target.value);
    }

    const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationFormCapacity(event.target.value);
    }

    const onDimensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationFormDimension(event.target.value);
    }

    const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationFormBrand(event.target.value);
    }

    const onMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationFormMaterial(event.target.value);
    }

    const onSelectType = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        dashboardHandler.setTankCreationFormType(event.target.value);
    }



    return (
        <>
            <PopUpFormTemplate
                title="Add Tank"
                open={props.showAddTankMenu}
                onCancel={onClose}
                onSubmit={() => { }}
                submitButtonText="Add"
                onCancelButtonText="Cancel"
                fields={[
                    {
                        name: "Name",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.name,
                        onChange: onNameChange,
                        error: false,
                    },
                    {
                        name: "Type",
                        type: "select",
                        placeholder: "",
                        value: props.tankCreationForm.type,
                        onChange: onSelectType,
                        error: false,
                        selectItems: ["Storage", "Well", "Reservoir", "Tank", "Other"]
                    },
                    {
                        name: "Capacity",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.capacity,
                        onChange: onCapacityChange,
                        error: false,
                    },
                    {
                        name: "Dimensions",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.dimension,
                        onChange: onDimensionChange,
                        error: false,
                    },
                    {
                        name: "Brand",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.brand,
                        onChange: onBrandChange,
                        error: false,
                    },
                    {
                        name: "Material",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.material,
                        onChange: onMaterialChange,
                        error: false,
                    }
                ]}
            />
        </>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        tankCreationForm: state.dashboard.tankCreationForm,
        showAddTankMenu: state.dashboard.showAddTankMenu
    }
}

export default connect(mapStateToProps, {})(AddWaterTankPopUp);


