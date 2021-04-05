import { CementoTopic } from '@decent-bet/cemento';

export class Web3CementoTopic  implements CementoTopic  {
    private next = [];
    constructor() {}


    topic(value: string) {
        this.next = [...this.next, value];
        return this;
    }

    or(value) {
        this.next = [...this.next, value];
        return this;
    }

    and(value) {
        this.next = [[...this.next, value]];
        return this;
    }
    get() {
        return this.next;
    }
}
