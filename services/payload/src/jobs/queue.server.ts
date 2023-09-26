import type { Processor } from 'bullmq';
import { QueueEvents } from 'bullmq';
import { Queue, Worker } from 'bullmq';
import payload from 'payload';

const redisUrl = process.env.REDIS_URL ?? 'localhost';
const redisPort = Number(process.env.REDIS_PORT ?? '6379');

// redis settings...
const connection = {
    host: redisUrl,
    port: redisPort,
};

type AugmentedQueue<T> = Queue<T> & {
    events: QueueEvents;
};
type RegisteredQueue = {
    queue: Queue;
    queueEvents: QueueEvents;
    worker: Worker;
};
declare global {
    var __registeredQueues: Record<string, RegisteredQueue> | undefined;
}
const registeredQueues = global.__registeredQueues || (global.__registeredQueues = {});
/**
 *
 * @param name Unique name of the queue
 * @param processor
 */
export function registerQueue<T>(name: string, processor: Processor<T>) {
    if (!registeredQueues[name]) {
        const queue = new Queue(name, { connection });
        const queueEvents = new QueueEvents(name, {
            connection,
        });
        const worker = new Worker<T>(name, processor, {
            connection,
            lockDuration: 1000 * 60 * 15,
            concurrency: 8,
        });
        registeredQueues[name] = {
            queue,
            queueEvents,
            worker,
        };
    }
    const queue = registeredQueues[name].queue as AugmentedQueue<T>;
    queue.events = registeredQueues[name].queueEvents;
    return queue;
}

// This will run in the same thread as the main app
// if this is more processor intensive then we should offload this to a background process
/*
"If we pass a path to a javascript file instead of a function to 
the registerQueue function, BullMQ will spawn a new process to run the file. 
These are called sandboxed processors."
*/
export const emailQueue = registerQueue('email', async (job: any) => {
    console.log('///emailQueue job', job);
    const { to, subject, text, html } = job.data;
    await payload.sendEmail({ to, subject, text, html });
});
