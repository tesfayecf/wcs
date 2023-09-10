'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';
import TanksHandler from '../../TanksHandler';
import PopUpTemplate from '@/app/components/popUpTemplate/PopUpTemplate';
import { ITankGroupCreationFormN } from '../../TanksTypes';

const tanksHandler = TanksHandler.getInstance();


interface IAddTankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const AddTankPopUp: React.FunctionComponent<IAddTankPopUpProps> = (props: IAddTankPopUpProps) => {

    const onClose = () => {
        tanksHandler.setShowAddTankMenu(false);
    }

    const onCreate = (fields: ITankGroupCreationFormN) => {
        tanksHandler.createTank(fields);
    }

    return (
        <PopUpTemplate
            open={props.showAddTankMenu}
            onClose={onClose}
        >
            <FormTemplate<ITankGroupCreationFormN>
                title="Create Tank"
                onAccept={onCreate}
                acceptButtonText="Create"
                cancelButtonText="Cancel"
                externalError={false}
                externalErrorText={"Invalid data"}
                hideCancelButton={false}
                isLoading={props.isFormLoading}
                fields={[
                    {
                        name: "Name",
                        type: "text",
                        placeholder: "Name",
                    },
                    {
                        name: "Capacity",
                        type: "text",
                        placeholder: "Capacity",
                        textType: "number"
                    },
                    {
                        name: "Type",
                        type: "select",
                        selectItems: ["Storage", "Well", "Reservoir", "Tank", "Other"],
                        placeholder: "Type",
                    },
                    {
                        name: "Dimension",
                        type: "text",
                        placeholder: "Dimension",
                    },
                    {
                        name: "Material",
                        type: "text",
                        placeholder: "Material",
                    },
                    {
                        name: "Brand",
                        type: "text",
                        placeholder: "Brand",
                    },
                ]}
            />
        </PopUpTemplate>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        showAddTankMenu: state.tanks.showAddTankMenu,
        isFormLoading: state.app.loading.isFormLoading,
    }
}

export default connect(mapStateToProps, {})(AddTankPopUp);


