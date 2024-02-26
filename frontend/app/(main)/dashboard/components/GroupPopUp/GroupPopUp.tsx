'use client'
import React from 'react';
import FormTemplate from '@/app/components/formTemplate/FormTemplate';
import PopUpTemplate from '@/app/components/popUpTemplate/PopUpTemplate';
import { IGroupCreationForm } from '@/app/(main)/dashboard/types';
import useDashboardStore from '@/app/(main)/dashboard/store';
import { createGroup, deleteGroup, editGroup, getGroups } from '../../actions';

interface IFroupPopUpProps { }

const GroupPopUp: React.FunctionComponent<IFroupPopUpProps> = (props: IFroupPopUpProps) => {
    const groups = useDashboardStore((state) => state.groups);
    const groupMenu = useDashboardStore((state) => state.groupMenu);
    const setGroupMenu = useDashboardStore((state) => state.setGroupMenu);

    let group = undefined;
    if (groupMenu.mode == "edit" || groupMenu.mode == "delete") {
        group = groups.find(g => g.id == groupMenu.id);
        if (!group) {
            setGroupMenu({ id: -1, mode: "", show: false })
            return <></>
        }
    }

    const onAccept = async (fields: IGroupCreationForm) => {
        let response = undefined;
        if (groupMenu.mode == "create") {
            response = await createGroup(fields);
            if (response.ok) await getGroups() // Update groups RTQ query
        } else if (groupMenu.mode == "edit") {
            response = await editGroup(groupMenu.id, fields);
            if (response.ok) await getGroups() // Update groups
        } else if (groupMenu.mode == "delete") {
            response = await deleteGroup(groupMenu.id);
        }

        setGroupMenu({ id: -1, mode: "", show: false })
        if (response.ok) await getGroups() // Update groups
        else console.log("Error") // Show error message

    }

    return (
        <PopUpTemplate
            open={groupMenu.show}
            onClose={() => setGroupMenu({ id: -1, mode: "", show: false })
            }
        >
            <FormTemplate<IGroupCreationForm>
                title="Create Group"
                externalError={false}
                externalErrorText={"Invalid data"}
                onCancel={() => setGroupMenu({ id: -1, mode: "", show: false })}
                onAccept={onAccept}
                acceptButton={groupMenu.mode.toLocaleUpperCase()}
                cancelButton="Cancel"
                showCancelButton={true}
                isLoading={false}
                fields={[
                    {
                        key: "name",
                        name: "Name",
                        type: "text",
                        placeholder: "",
                        defaultValue: group?.name,
                    },
                    {
                        key: "location",
                        name: "Location",
                        type: "text",
                        placeholder: "",
                        defaultValue: group?.location,
                    },
                    {
                        key: "description",
                        name: "Description",
                        type: "multitext",
                        placeholder: "",
                        rows: 3,
                        defaultValue: group?.description,
                    },
                ]}
            />
        </PopUpTemplate>
    )
};

export default GroupPopUp;


