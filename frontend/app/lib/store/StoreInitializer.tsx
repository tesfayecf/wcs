'use client'
import { IUserInfo } from "@/app/app/AppTypes";
import useAppStore from "./appStore";
import useDashboardStore from "./dashboardStore";
import { IGroup } from "@/app/(main)/dashboard/DashboardTypes";
import useGroupStore from "./groupStore";
import { ITank } from "@/app/(main)/group/[groupId]/GroupTypes";

export interface IStoreInitializer {
    userInfo?: IUserInfo;

    groups?: IGroup[];
    summary?: any;

    groupParam?: string;
    tanks?: ITank[];
    groupInfo?: IGroup;
}

export const StoreInitializer: React.FunctionComponent<IStoreInitializer> = (props: IStoreInitializer) => {
    /// App \\\
    const setUserInfo = useAppStore(state => state.setUserInfo);
    if (props.userInfo) setUserInfo(props.userInfo);

    /// Dashboard \\\
    const setGroups = useDashboardStore(state => state.setGroups);
    if (props.groups) setGroups(props.groups)

    const setSummary = useDashboardStore(state => state.setSummary);
    if (props.summary) setSummary(props.summary)

    /// Group \\\
    const setParams = useGroupStore(state => state.setParams);
    if (props.groups) setParams({ groupId: props.groupParam })

    const setTanks = useGroupStore(state => state.setTanks);
    if (props.tanks) setTanks(props.tanks)

    const setGroupInfo = useGroupStore(state => state.setGroupInfo);
    if (props.groupInfo) setGroupInfo(props.groupInfo)

    console.log("StoreInitializer", props)

    if (props.userInfo) {
        return <></>
    }


    return null;
};