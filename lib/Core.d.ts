import { Events } from 'easy-event-emitter';
import type { TConfig, TCacheBody, TData, TGroupsData } from './types';
declare abstract class Core {
    private cache;
    initData: TGroupsData;
    protected readonly events: Events;
    config: TConfig;
    constructor(context?: Core);
    protected setConfig(config: TConfig): void;
    protected getCache(key: string): TData | undefined;
    protected isJsonString(str: string): boolean;
    protected jsonParse(str: string): any;
    setHost(host: string): void;
    protected setCache(key: string, data: TData, group?: string): void;
    protected groupFromArray<T = string>(groups: T | T[], callback: (group: T, params?: string[]) => void, withoutSplit?: boolean): void;
    triggerByCacheGroup(groups: string | string[]): void;
    clearCacheGroup(groups: string | string[], data?: TData, fieldKey?: string | null): void;
    private setDataTree;
    updateCacheGroup(groups: string | string[], data: TData, fieldKey?: string | null): void;
    appendCacheGroup(group: string, data: TData): void;
    protected getCacheByIndex(index: string): TCacheBody;
    protected deleteCache(key: string): void;
    setInitData(data: TGroupsData): void;
}
export default Core;
