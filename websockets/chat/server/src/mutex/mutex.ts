import Redis from "ioredis";

export class Mutex {
    private readonly sub: Redis
    private isLocked = false;

    constructor(readonly redis: Redis, readonly lockName: string) {
        this.sub = this.redis.duplicate();

        this.sub.subscribe(this.lockName);
        this.sub.on('message', (_, message) => {
            const parsed = JSON.parse(message);
            if(parsed.lock !== undefined) {
                this.isLocked = parsed.lock;
            }
        });
    }

    lock(): void {
        while (this.isLocked) {
            // Wait until will be unlocked to lock new transaction
        }
        this.isLocked = true;
        this.redis.publish(this.lockName, JSON.stringify({ lock: true }));
    }

    unlock(): void {
        this.isLocked = false;
        this.redis.publish(this.lockName, JSON.stringify({ lock: false }));
    }
}