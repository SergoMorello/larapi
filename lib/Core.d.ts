import { Events, Event } from 'easy-event-emitter';
import { TData, TGroupsData, TListenerEvents } from './types';
declare abstract class Core {
    private cache;
    initData: TGroupsData;
    protected events: Events;
    host: string;
    token: string;
    constructor(context?: Core);
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    protected getCache(request: string): TData | undefined;
    setHost(host: string): void;
    protected setCache(request: string, data: TData, group?: string): void;
    deleteCacheGroup(group: string): void;
    protected deleteCache(request: string): void;
    setInitData(data: TGroupsData): void;
}
export default Core;
