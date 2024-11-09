// GroupRecordsManager.ts

import { Api } from "@/app/lib/api/types";
import { getGroupRecords } from "@/app/(app)/dashboard/actions";

type CacheKey = string;
type CachedData = {
    data: any[];
    expiry: number;
};

export class DashboardRecordsManager {
    private cache: Map<CacheKey, CachedData>;
    private cacheDuration: number; // in milliseconds

    constructor(cacheDuration = 5 * 60 * 1000) { // default cache: 5 minutes
        this.cacheDuration = cacheDuration;
        this.cache = new Map();
    }

    async fetchGroupRecords(group: Api.Resources.Group, period: { startTime: Date, endTime: Date }, timeframe: Api.Timeseries.TimeframeChoiceEnum): Promise<any[]> {
        const cacheKey = this.createCacheKey(group.id.toString(), period, timeframe);

        // Check cache
        if (this.isCached(cacheKey)) {
            console.log(`Cache hit for group ${group.id}`);
            return this.cache.get(cacheKey)!.data;
        }

        console.log(`Fetching new data for group ${group.id}`);
        const { startTime, endTime } = period;
        const response = await getGroupRecords(group.id, startTime.toISOString(), endTime.toISOString(), timeframe);

        if (response.error) {
            console.error("Error fetching group records:", response.error);
            return [];
        }

        const records = response.data.map(record => ({
            ...record,
            time: new Date(record.time).toISOString(),
            group_id: group.id,
            group_name: group.name,
            group_location: group.location
        }));

        // Cache the response
        this.cache.set(cacheKey, {
            data: records,
            expiry: Date.now() + this.cacheDuration,
        });

        return records;
    }

    private createCacheKey(groupId: string, period: { startTime: Date, endTime: Date }, timeframe: Api.Timeseries.TimeframeChoiceEnum): CacheKey {
        return `${groupId}-${timeframe}-${period.startTime.toISOString()}-${period.endTime.toISOString()}`;
    }

    private isCached(cacheKey: CacheKey): boolean {
        const cachedData = this.cache.get(cacheKey);
        if (!cachedData) return false;

        // Check if cache entry has expired
        if (cachedData.expiry < Date.now()) {
            this.cache.delete(cacheKey);
            return false;
        }

        return true;
    }

    public clearCache() {
        this.cache.clear();
    }

    public static getTimeRange = (timeframe: Api.Timeseries.TimeframeChoiceEnum): { startTime: Date, endTime: Date } => {
        const endTime = new Date();
        const startTime = new Date();
        switch (timeframe) {
            case Api.Timeseries.TimeframeChoiceEnum.MINUTE:
                startTime.setMinutes(endTime.getMinutes() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.HOUR:
                startTime.setHours(endTime.getHours() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.DAY:
                startTime.setDate(endTime.getDate() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.WEEK:
                startTime.setDate(endTime.getDate() - 7);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.MONTH:
                startTime.setMonth(endTime.getMonth() - 1);
                break;
            case Api.Timeseries.TimeframeChoiceEnum.YEAR:
                startTime.setFullYear(endTime.getFullYear() - 1);
                break;
        }
        return { startTime, endTime };
    };
}
