'use client'
import React from 'react';
import Form from '@/app/components/form/Form';
import Popup from '@/app/components/popup/Popup';
import { ITankCreationForm } from '@/app/(app)/group/[groupId]/types';

import { createTank, getTanks } from '../../actions';
import { useGroupStore } from '@/app/(app)/group/[groupId]/store';


interface ITankPopUpProps { }

const TankPopUp: React.FunctionComponent<ITankPopUpProps> = (props: ITankPopUpProps) => {
    const groupId = useGroupStore(state => state.groupId);
    const showTankMenu = useGroupStore(state => state.showTankMenu);
    const setShowTankMenu = useGroupStore(state => state.setShowTankMenu);

    const onCreate = async (fields: ITankCreationForm) => {
        const response = await createTank(fields, groupId);
        setShowTankMenu(false);
        if (response.ok) await getTanks(groupId);
        // else return // Show error message
    }

    return (
        <Popup
            open={showTankMenu}
            onClose={() => setShowTankMenu(false)}
        >
            <Form<ITankCreationForm>
                title="Create Tank"
                externalError={false}
                externalErrorText={"Invalid data"}
                onCancel={() => setShowTankMenu(false)}
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
        </Popup>
    )
};

export default TankPopUp;


