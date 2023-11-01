import type Http from "./Http";
declare class Queue {
    private queue;
    has(request: string): boolean;
    push(request: string, instance: Http): boolean;
}
export default Queue;
