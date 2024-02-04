'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';
import GroupHandler from '@/app/(pages)/group/[groupId]/GroupHandler';
import PopUpTemplate from '@/app/components/popUpTemplate/PopUpTemplate';
import { ITankCreationForm } from '@/app/(pages)/group/[groupId]/GroupTypes';

const groupHandler = GroupHandler.getInstance();

interface ITankPopUpProps extends ReturnType<typeof mapStateToProps> { }

const TankPopUp: React.FunctionComponent<ITankPopUpProps> = (props: ITankPopUpProps) => {

    const onClose = () => {
        groupHandler.setShowTankMenu(false);
    }

    const onCreate = (fields: ITankCreationForm) => {
        groupHandler.createTank(fields);
    }

    return (
        <PopUpTemplate
            open={props.showTankMenu}
            onClose={onClose}
        >
            <FormTemplate<ITankCreationForm>
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
                        name: "",
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
        showTankMenu: state.group.showTankMenu,
        isFormLoading: state.app.loading.isFormLoading,
    }
}

export default connect(mapStateToProps, {})(TankPopUp);


