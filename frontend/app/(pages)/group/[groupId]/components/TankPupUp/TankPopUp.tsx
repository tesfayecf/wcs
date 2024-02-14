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
                externalError={false}
                externalErrorText={"Invalid data"}
                onCancel={onClose}
                onAccept={onCreate}
                acceptButton="Create"
                cancelButton="Cancel"
                showCancelButton={true}
                isLoading={props.isFormLoading}
                fields={[
                    {
                        key: "name",
                        name: "Name",
                        type: "text",
                        placeholder: "",
                    },
                    {
                        key: "type",
                        name: "Type",
                        type: "select",
                        selectItems: ["Storage", "Well", "Reservoir", "Tank", "Other"],
                        defaultValue: "Storage",
                        placeholder: "",
                    },
                    {
                        key: "capacity",
                        name: "Capacity",
                        type: "text",
                        placeholder: "",
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


