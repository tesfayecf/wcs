// 'use client'
// import React from 'react';
// import { useStore } from '@/app/store/store';
// import styles from './styles/AddWaterTankPopUp.module.scss';
// import DashboardHandler from '../../DashboardHandler';
// import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// const dashboardHandler = DashboardHandler.getInstance();

// interface IAddWaterTankPopUpProps {

// }

// const AddWaterTankPopUp: React.FunctionComponent<IAddWaterTankPopUpProps> = (props: IAddWaterTankPopUpProps) => {

//     const { showAddTankMenu, tankCreationForm } = useStore().DashboardStore;

//     const onClose = () => {
//         dashboardHandler.setShowAddTankMenu(false);
//     }

//     const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         dashboardHandler.setTankCreationForm({ ...tankCreationForm, name: event.target.value });
//     }

//     const onCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         dashboardHandler.setTankCreationForm({ ...tankCreationForm, capacity: event.target.value });
//     }

//     const onDimensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         dashboardHandler.setTankCreationForm({ ...tankCreationForm, dimension: event.target.value });
//     }

//     const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         dashboardHandler.setTankCreationForm({ ...tankCreationForm, brand: event.target.value });
//     }

//     const onMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         dashboardHandler.setTankCreationForm({ ...tankCreationForm, material: event.target.value });
//     }

//     const onSelectType = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
//         dashboardHandler.setTankCreationForm({ ...tankCreationForm, type: event.target.value });
//     }



//     return (
//         <>
//             <Dialog open={showAddTankMenu} onClose={onClose}>
//                 <DialogTitle>ADD WATER TANK</DialogTitle>
//                 <div>
//                     <h1>ADD WATER TANK</h1>
//                 </div>
//                 <DialogContent>
//                     <TextField autoFocus onChange={onNameChange} id='name' label='Name' fullWidth variant='standard' />
//                     <Select
//                         labelId="type-selector"
//                         id="type"
//                         value={tankCreationForm.type}
//                         label="Type"
//                         onChange={onSelectType}
//                     >
//                         <MenuItem value="Storage">Storage</MenuItem>
//                         <MenuItem value="Reservoir">Reservoir</MenuItem>
//                         <MenuItem value="Well">Well</MenuItem>
//                         <MenuItem value="Tank">Tank</MenuItem>
//                         <MenuItem value="Other">Other</MenuItem>
//                     </Select>
//                     <TextField onChange={onCapacityChange} id='capacity' label='capacity' fullWidth variant='standard' />
//                     <TextField onChange={onDimensionChange} id='dimension' label='dimension' fullWidth variant='standard' />
//                     <TextField onChange={onBrandChange} id='brand' label='brand' fullWidth variant='standard' />
//                     <TextField onChange={onMaterialChange} id='material' label='material' fullWidth variant='standard' />
//                 </DialogContent>

//             </Dialog>
//         </>
//     )
// };


// export default AddWaterTankPopUp;

