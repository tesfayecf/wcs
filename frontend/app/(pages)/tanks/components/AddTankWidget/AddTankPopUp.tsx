'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import PopUpFormTemplate from '@/app/components/popUpFormTemplate/PopUpFormTemplate';
import TanksHandler from '../../TanksHandler';

const tanksHandler = TanksHandler.getInstance();


interface IAddTankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const AddTankPopUp: React.FunctionComponent<IAddTankPopUpProps> = (props: IAddTankPopUpProps) => {

    const onClose = () => {
        tanksHandler.setShowAddTankMenu(false);
        tanksHandler.setTankCreationForm({
            name: "", nameError: false, capacity: 0, capacityError: false,
            brand: "", brandError: false, material: "", materialError: false,
            dimensions: "", dimensionsError: false, type: "", typeError: false,
        })
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        tanksHandler.setTankCreationFormName(event.target.value);
    }

    const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        tanksHandler.setTankCreationFormCapacity(parseInt(event.target.value));
    }

    const onMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        tanksHandler.setTankCreationFormMaterial(event.target.value);
    }

    const onDimensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        tanksHandler.setTankCreationFormDimension(event.target.value);
    }

    const onTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        tanksHandler.setTankCreationFormType(event.target.value);
    }

    const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        tanksHandler.setTankCreationFormBrand(event.target.value);
    }

    const onCreate = () => {
        tanksHandler.createTank();
    }

    return (
        <>
            <PopUpFormTemplate
                title="Add Tank Group"
                open={props.showAddTankMenu}
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
                        value: props.tankCreationForm.name,
                        onChange: onNameChange,
                        error: props.tankCreationForm.nameError,
                    },
                    {
                        name: "Capacity",
                        type: "textInput",
                        placeholder: "",
                        value: String(props.tankCreationForm.capacity),
                        onChange: onCapacityChange,
                        error: props.tankCreationForm.capacityError,
                    },
                    {
                        name: "Type",
                        type: "select",
                        selectItems: ["Storage", "Well", "Reservoir", "Tank", "Other"],
                        placeholder: "Type",
                        value: props.tankCreationForm.type,
                        onChange: onTypeChange,
                        error: props.tankCreationForm.typeError,
                    },
                    {
                        name: "Dimension",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.dimensions,
                        onChange: onDimensionChange,
                        error: props.tankCreationForm.dimensionsError,
                    },
                    {
                        name: "Material",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.material,
                        onChange: onMaterialChange,
                        error: props.tankCreationForm.materialError,
                    },
                    {
                        name: "Brand",
                        type: "textInput",
                        placeholder: "",
                        value: props.tankCreationForm.brand,
                        onChange: onBrandChange,
                        error: props.tankCreationForm.brandError,
                    },
                ]}
            />
        </>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        tankCreationForm: state.tanks.tankCreationForm,
        showAddTankMenu: state.tanks.showAddTankMenu
    }
}

export default connect(mapStateToProps, {})(AddTankPopUp);


