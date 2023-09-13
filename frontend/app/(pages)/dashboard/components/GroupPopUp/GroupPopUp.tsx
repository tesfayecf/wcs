'use client'
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from '@/app/utils/store/store';
import DashboardHandler from '@/app/(pages)/dashboard/DashboardHandler';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';
import PopUpTemplate from '@/app/components/popUpTemplate/PopUpTemplate';
import { IGroupCreationForm } from '../../DashboardTypes';

const dashboardHandler = DashboardHandler.getInstance();

interface IFroupPopUpProps extends ReturnType<typeof mapStateToProps> { }

const GroupPopUp: React.FunctionComponent<IFroupPopUpProps> = (props: IFroupPopUpProps) => {

    const onClose = (ev: any) => {
        dashboardHandler.setShowGroupMenu(false);
    }

    const onCreate = async (fields: IGroupCreationForm) => {
        await dashboardHandler.createGroup(fields);
    }

    return (
        <PopUpTemplate
            open={props.showGroupMenu}
            onClose={onClose}
        >
            <FormTemplate<IGroupCreationForm>
                title="Create Tank Group"
                externalError={false}
                externalErrorText={"Invalid data"}
                onCancel={onClose}
                onAccept={onCreate}
                acceptButtonText="Create"
                cancelButtonText="Cancel"
                hideCancelButton={false}
                isLoading={props.isFormLoading}
                fields={[
                    {
                        name: "Name",
                        type: "text",
                        placeholder: "",
                    },
                    {
                        name: "Location",
                        type: "text",
                        placeholder: "",
                        // textType: "location"
                    },
                    {
                        name: "Description",
                        type: "multitext",
                        placeholder: "",
                        rows: 3,
                    },
                ]}
            />
        </PopUpTemplate>
    )
};

const mapStateToProps = (state: IRootState) => {
    return {
        showGroupMenu: state.dashboard.showGroupMenu,
        isFormLoading: state.app.loading.isFormLoading,
    }
}

export default connect(mapStateToProps, {})(GroupPopUp);


