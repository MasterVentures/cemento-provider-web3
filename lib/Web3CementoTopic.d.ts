import { CementoTopic } from '@MasterVentures/cemento';
export declare class Web3CementoTopic implements CementoTopic {
    private next;
    constructor();
    topic(value: string): this;
    or(value: any): this;
    and(value: any): this;
    get(): any[];
}
