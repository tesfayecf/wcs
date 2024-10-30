'use client'
import React from 'react';
import { Group } from "@/app/(app)/group/[groupId]/types";
import Form from '@/app/components/form/Form';
import Popup from '@/app/components/popup/Popup';
import useDashboardStore from '@/app/(app)/dashboard/store';
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
            setGroupMenu({ id: -1, mode: "", show: false });
            console.error("Grup not found");
            return null;
        }
    }

    const onAccept = async (fields: Group.IGroupForm) => {
        let response = undefined;
        if (groupMenu.mode == "create") response = await createGroup(fields);
        else if (groupMenu.mode == "edit") response = await editGroup(groupMenu.id, fields);
        else if (groupMenu.mode == "delete") response = await deleteGroup(groupMenu.id);

        setGroupMenu({ id: -1, mode: "", show: false });
        if (response.ok) await getGroups(); // Update groups
        else console.error("Error when executing form action"); // Show error message
    }

    const onCancel = () => {
        setGroupMenu({ id: -1, mode: "", show: false });
    }

    return (
        <Popup
            open={groupMenu.show}
            onClose={() => setGroupMenu({ id: -1, mode: "", show: false })
            }
        >
            {groupMenu.mode == "delete" ?
                null
                :
                <Form<Group.IGroupForm>
                    title="Create Group"
                    externalError={false}
                    externalErrorText={"Invalid data"}
                    onCancel={onCancel}
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
                />}
        </Popup>
    )
};

export default GroupPopUp;