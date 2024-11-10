import { EventEmitter } from 'events';
import { TimeframeChoiceEnum } from '../api/types/timeseries.serializers';

export class ChartManager<TConfig extends Record<string, any>, TData> extends EventEmitter {
    private currentConfig: TConfig | null = null;
    private currentData: TData[] | null = null;
    private fetchPromise: Promise<TData[]> | null = null;
    private lastFetchTime: number = 0;
    private readonly refreshInterval: number;

    constructor(refreshInterval: number = 60000) { // default 1 minute
        super();
        this.refreshInterval = refreshInterval;
    }

    public async updateData(
        config: TConfig,
        fetchFn: (config: TConfig) => Promise<TData[]>
    ): Promise<TData[]> {
        // If config hasn't changed and data is fresh, return current data
        if (this.isConfigEqual(config) && this.isDataFresh()) {
            return this.currentData!;
        }

        // Config changed - emit event
        if (!this.isConfigEqual(config)) {
            this.currentConfig = config;
            this.emit(ChartEvents.CONFIG_CHANGED, config);
        }

        // If there's an ongoing fetch, wait for it
        if (this.fetchPromise) {
            return this.fetchPromise;
        }

        return this.fetchData(fetchFn);
    }

    private async fetchData(
        fetchFn: (config: TConfig) => Promise<TData[]>
    ): Promise<TData[]> {
        if (!this.currentConfig) {
            throw new Error('Configuration not set');
        }

        this.emit(ChartEvents.LOADING);

        try {
            this.fetchPromise = fetchFn(this.currentConfig).then(data => {
                this.currentData = data;
                this.lastFetchTime = Date.now();
                this.emit(ChartEvents.LOADED, data);
                return data;
            });

            const records = await this.fetchPromise;
            this.fetchPromise = null;
            return records;

        } catch (error) {
            this.fetchPromise = null;
            this.emit(ChartEvents.ERROR, error);
            throw error;
        }
    }

    private isConfigEqual(newConfig: TConfig): boolean {
        if (!this.currentConfig) return false;
        return JSON.stringify(this.currentConfig) === JSON.stringify(newConfig);
    }

    private isDataFresh(): boolean {
        return (
            this.currentData !== null &&
            Date.now() - this.lastFetchTime < this.refreshInterval
        );
    }

    public getCurrentData(): TData[] | null {
        return this.currentData;
    }

    public getCurrentConfig(): TConfig | null {
        return this.currentConfig;
    }
}

export enum ChartEvents {
    LOADING = 'loading',
    LOADED = 'loaded',
    ERROR = 'error',
    CONFIG_CHANGED = 'config_changed'
}

// Types for the Groups Area Chart
export enum PeriodEnum {
    LAST_HOUR = 'last_hour',
    LAST_DAY = 'last_day',
    LAST_WEEK = 'last_week',
    LAST_MONTH = 'last_month',
    LAST_YEAR = 'last_year',
    CUSTOM = 'custom'
}

export interface TimeRange {
    startTime: Date;
    endTime: Date;
}

export interface GroupChartConfig {
    groupId: number;
    groupName: string;
    tankId?: number;
    timeframe: TimeframeChoiceEnum;
    period: PeriodEnum;
    customRange?: TimeRange;
}

export interface GroupChartRecord {
    time: string;
    group_id: number;
    group_name: string;
    tank_id?: number;
    value: number;
    [key: string]: any;
}
