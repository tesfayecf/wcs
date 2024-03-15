'use client'
import { IUserInfo } from "@/app/app/types";
import useAppStore from "../../app/store";
import useDashboardStore from "../../(main)/dashboard/store";
import { IGroup, ISummary } from "@/app/(main)/dashboard/types";
import useGroupStore from "../../(main)/group/[groupId]/store";
import { ITank } from "@/app/(main)/group/[groupId]/types";

export interface IStoreInitializer {
    /// App \\\
    userInfo?: IUserInfo;

    /// Dashboard \\\
    groups?: IGroup[];
    summary?: ISummary;

    /// Group \\\
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
    if (props.groupParam) setParams({ groupId: props.groupParam })

    const setTanks = useGroupStore(state => state.setTanks);
    if (props.tanks) setTanks(props.tanks)

    const setGroupInfo = useGroupStore(state => state.setGroupInfo);
    if (props.groupInfo) setGroupInfo(props.groupInfo)

    const setLoadingState = useAppStore(state => state.setLoadingState);
    setLoadingState(false)

    return null;
};