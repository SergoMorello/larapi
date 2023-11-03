import { Events } from 'easy-event-emitter';
import type { TCacheBody, TData, TGroupsData } from './types';
declare abstract class Core {
    private cache;
    initData: TGroupsData;
    protected events: Events;
    host: string;
    constructor(context?: Core);
    protected getCache(key: string): TData | undefined;
    protected isJsonString(str: string): boolean;
    setHost(host: string): void;
    protected setCache(key: string, data: TData, group?: string): void;
    clearCacheGroup(group: string, data?: TData, fieldKey?: string | null): void;
    updateCacheGroup(group: string, data: TData, fieldKey?: string | null): void;
    protected getCacheByIndex(index: string): TCacheBody;
    protected deleteCache(key: string): void;
    setInitData(data: TGroupsData): void;
}
export default Core;
