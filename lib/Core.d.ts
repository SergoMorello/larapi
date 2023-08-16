import { Events, Event } from 'easy-event-emitter';
import { TCache, TMethod, TParams, TListenerEvents } from './types';
declare abstract class Core {
    private host;
    token: string;
    cache: TCache;
    protected events: Events;
    constructor();
    protected request(method: TMethod, params: TParams): {
        clearCache: () => void;
    };
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    private getCache;
    setHost(host: string): void;
    private setCache;
    private deleteCacheGroup;
    private deleteCache;
    setToken(token: string): void;
    getToken(): string;
}
export default Core;
