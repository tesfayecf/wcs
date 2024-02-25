'use client'
import React from 'react';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';
import PopUpTemplate from '@/app/components/popUpTemplate/PopUpTemplate';
import { IGroupCreationForm } from '@/app/(main)/dashboard/types';
import useDashboardStore from '@/app/(main)/dashboard/store';
import { createGroup, getGroups } from '../../actions';

interface IFroupPopUpProps { }

const GroupPopUp: React.FunctionComponent<IFroupPopUpProps> = (props: IFroupPopUpProps) => {
    const showGroupMenu = useDashboardStore((state) => state.showGroupMenu);
    const setShowGroupMenu = useDashboardStore((state) => state.setShowGroupMenu);

    const onCreate = async (fields: IGroupCreationForm) => {
        const response = await createGroup(fields);
        setShowGroupMenu(false)
        if (response.ok) await getGroups()
        // else return // Show error message
    }

    return (
        <PopUpTemplate
            open={showGroupMenu}
            onClose={() => setShowGroupMenu(false)}
        >
            <FormTemplate<IGroupCreationForm>
                title="Create Group"
                externalError={false}
                externalErrorText={"Invalid data"}
                onCancel={() => setShowGroupMenu(false)}
                onAccept={onCreate}
                acceptButton="Create"
                cancelButton="Cancel"
                showCancelButton={true}
                isLoading={false}
                fields={[
                    {
                        key: "name",
                        name: "Name",
                        type: "text",
                        placeholder: "",
                    },
                    {
                        key: "location",
                        name: "Location",
                        type: "text",
                        placeholder: "",
                    },
                    {
                        key: "description",
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

export default GroupPopUp;


