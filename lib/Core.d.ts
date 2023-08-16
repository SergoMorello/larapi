import { Events, Event } from 'easy-event-emitter';
import { TCache, TGroupsData, TMethod, TParams, TListenerEvents } from './types';
declare abstract class Core {
    private host;
    token: string;
    cache: TCache;
    initData: TGroupsData;
    protected events: Events;
    constructor();
    protected request(method: TMethod, params: TParams): {
        clearCache: () => void;
    } | undefined;
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    private getCache;
    setHost(host: string): void;
    private setCache;
    private deleteCacheGroup;
    private deleteCache;
    setInitData(data: TGroupsData): void;
}
export default Core;
