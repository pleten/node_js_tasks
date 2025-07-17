
export class CustomMutex {
    private sharedData;

    constructor(sharedData: Int32Array<SharedArrayBuffer>) {
        this.sharedData = sharedData;
    }

    lock(lockIndex: number) {
        while (Atomics.compareExchange(this.sharedData, lockIndex, 0, 1) !== 0) {
        }
    }

    unlock(lockIndex: number) {
        Atomics.store(this.sharedData, lockIndex, 0);
    }
}