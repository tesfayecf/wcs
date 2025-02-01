'use client'
import { useAppStore } from "../../app/store";
import { useDashboardStore } from "../../(app)/dashboard/store";
import { useGroupStore } from "../../(app)/group/[groupId]/store";

import { App } from "@/app/app/types";
import { Dashboard } from "@/app/(app)/dashboard/types";
import { Group } from "@/app/(app)/group/[groupId]/types";

export interface IStoreInitializer {
    app?: Partial<App.IAppStore>
    dashboard?: Partial<Dashboard.IDashboardStore>;
    group?: Partial<Group.IGroupStore>;
}

export const StoreInitializer: React.FunctionComponent<IStoreInitializer> = (props: IStoreInitializer) => {
    if (props.app) useAppStore.setState(props.app);
    if (props.dashboard) useDashboardStore.setState(props.dashboard);
    if (props.group) useGroupStore.setState(props.group);
    return null;
};
