'use client'
import { IUserInfo } from "@/app/app/types";
import useAppStore from "../../app/store";
import useDashboardStore from "../../(main)/dashboard/store";
import { IGroup, ISummary } from "@/app/(main)/dashboard/types";
import useGroupStore from "../../(main)/group/[groupId]/store";
import { ITank } from "@/app/(main)/group/[groupId]/types";

export interface IStoreInitializer {
    /// App \\\
    app?: {
        userInfo?: IUserInfo;
    }
    /// Dashboard \\\
    dashboard?: {
        groups?: IGroup[];
        summary?: ISummary;
    }
    /// Group \\\
    group?: {
        groupParam?: string;
        group?: IGroup;
        tanks?: ITank[];
    }
}

export const StoreInitializer: React.FunctionComponent<IStoreInitializer> = (props: IStoreInitializer) => {
    /// App \\\
    if (props.app) useAppStore.setState(props.app);
    /// Dashboard \\\
    if (props.dashboard) useDashboardStore.setState(props.dashboard);
    /// Group \\\
    if (props.group) useGroupStore.setState(props.group);

    return null;
};