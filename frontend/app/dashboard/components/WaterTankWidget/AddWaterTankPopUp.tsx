'use client'
import React from 'react';
import { useStore } from '@/app/store/store';
// import styles from './styles/AddWaterTankPopUp.module.scss';
import DashboardHandler from '../../DashboardHandler';
import { SelectChangeEvent } from '@mui/material';
import PopUpFormTemplate from '@/app/components/popUp/PopUpFormTemplate';

const dashboardHandler = DashboardHandler.getInstance();

interface IAddWaterTankPopUpProps { }

const AddWaterTankPopUp: React.FunctionComponent<IAddWaterTankPopUpProps> = (props: IAddWaterTankPopUpProps) => {

    const tankCreationForm = useStore().DashboardStore.store.tankCreationForm;
    const showAddTankMenu = useStore().DashboardStore.store.showAddTankMenu;

    const onClose = () => {
        dashboardHandler.setShowAddTankMenu(false);
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...tankCreationForm, name: event.target.value });
    }

    // const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, capacity: event.target.value });
    // }

    const onDimensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...tankCreationForm, dimension: event.target.value });
    }

    const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...tankCreationForm, brand: event.target.value });
    }

    const onMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...tankCreationForm, material: event.target.value });
    }

    const onSelectType = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        dashboardHandler.setTankCreationForm({ ...tankCreationForm, type: event.target.value });
    }



    return (
        <>
            <PopUpFormTemplate
                title="Add Tank"
                open={showAddTankMenu}
                onCancel={onClose}
                onSubmit={() => { }}
                submitButtonText="Add"
                onCancelButtonText="Cancel"
                fields={[
                    {
                        name: "Name",
                        type: "textInput",
                        placeholder: "name",
                        value: tankCreationForm.name,
                        onChange: onNameChange,
                        error: false,
                    },
                    {
                        name: "Type",
                        type: "select",
                        placeholder: "type",
                        value: tankCreationForm.type,
                        onChange: onSelectType,
                        error: false,
                        selectItems: ["Storage", "Well", "Reservoir", "Tank", "Other"]
                    },
                    // {
                    //     name: "Capacity",
                    //     type: "textInput",
                    //     placeholder: "capacity",
                    //     value: store.tankCreationForm.capacity.toString(),
                    //     onChange: onCapacityChange,
                    //     error: false,
                    // },
                    {
                        name: "Dimensions",
                        type: "textInput",
                        placeholder: "dimensions",
                        value: tankCreationForm.dimension,
                        onChange: onDimensionChange,
                        error: false,
                    },
                    {
                        name: "Brand",
                        type: "textInput",
                        placeholder: "brand",
                        value: tankCreationForm.brand,
                        onChange: onBrandChange,
                        error: false,
                    },
                    {
                        name: "Material",
                        type: "textInput",
                        placeholder: "material",
                        value: tankCreationForm.material,
                        onChange: onMaterialChange,
                        error: false,
                    }
                ]}
            />
        </>
    )
};


export default AddWaterTankPopUp;

