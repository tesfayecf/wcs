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

    const store = useStore().DashboardStore.store;
    const { showAddTankMenu, tankCreationForm } = store;
    console.log(store);
    console.log(showAddTankMenu);
    console.log(tankCreationForm);

    const onClose = () => {
        dashboardHandler.setShowAddTankMenu(false);
    }

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, name: event.target.value });
    }

    // const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, capacity: event.target.value });
    // }

    const onDimensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, dimension: event.target.value });
    }

    const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, brand: event.target.value });
    }

    const onMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, material: event.target.value });
    }

    const onSelectType = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        dashboardHandler.setTankCreationForm({ ...store.tankCreationForm, type: event.target.value });
    }



    return (
        <>
            <PopUpFormTemplate
                title="Add Tank"
                open={store.showAddTankMenu}
                onCancel={onClose}
                onSubmit={() => { console.log(store.tankCreationForm) }}
                submitButtonText="Add"
                onCancelButtonText="Cancel"
                fields={[
                    {
                        name: "Name",
                        type: "textInput",
                        placeholder: "name",
                        value: store.tankCreationForm.name,
                        onChange: onNameChange,
                        error: false,
                    },
                    {
                        name: "Type",
                        type: "select",
                        placeholder: "type",
                        value: store.tankCreationForm.type,
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
                        value: store.tankCreationForm.dimension,
                        onChange: onDimensionChange,
                        error: false,
                    },
                    {
                        name: "Brand",
                        type: "textInput",
                        placeholder: "brand",
                        value: store.tankCreationForm.brand,
                        onChange: onBrandChange,
                        error: false,
                    },
                    {
                        name: "Material",
                        type: "textInput",
                        placeholder: "material",
                        value: store.tankCreationForm.material,
                        onChange: onMaterialChange,
                        error: false,
                    }
                ]}
            />
        </>
    )
};


export default AddWaterTankPopUp;

