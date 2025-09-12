import { makeAutoObservable } from 'mobx';

export default class CounterStore {
    title = 'Counter store';
    count = 42;
    events: string[] = [
        `Initial count is ${this.count}`
    ]

    constructor() {
        makeAutoObservable(this)
    }

    increment(amount = 1) {
        this.count += amount;
        this.events.push(`Incremented by ${amount} - count is now ${this.count}`);
    }

    // this convention with arrow function => helps as in other case like for above: increment, we had to bound to action in constructor.
    decrement = (amount = 1) => {
        this.count -= amount;
        this.events.push(`Decremented by ${amount} - count is now ${this.count}`);
    }

    get eventCount(){
        return this.events.length;
    }
}