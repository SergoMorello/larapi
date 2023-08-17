import { Events, Event } from 'easy-event-emitter';
import { TCacheBody, TData, TGroupsData, TListenerEvents } from './types';
declare abstract class Core {
    private cache;
    initData: TGroupsData;
    protected events: Events;
    host: string;
    token: string;
    constructor(context?: Core);
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    protected getCache(key: string): TData | undefined;
    setHost(host: string): void;
    protected setCache(key: string, data: TData, group?: string): void;
    clearCacheGroup(group: string): void;
    updateCacheGroup(group: string, fieldKey: string, data: TData): void;
    protected getCacheByIndex(index: string): TCacheBody;
    protected deleteCache(key: string): void;
    setInitData(data: TGroupsData): void;
}
export default Core;
