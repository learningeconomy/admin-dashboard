import type { Job, Processor } from 'bullmq';
import { FlowProducer, QueueEvents } from 'bullmq';
import { Queue, Worker } from 'bullmq';
import payload from 'payload';
import { PayloadRequest } from 'payload/types';
import { CREDENTIAL_BATCH_STATUS } from '../constants/batches';
import { CREDENTIAL_STATUS } from '../constants/credentials';

const redisUrl = process.env.REDIS_URL ?? 'localhost';
const redisPort = Number(process.env.REDIS_PORT ?? '6379');

// redis settings...
const connection = {
    host: redisUrl,
    port: redisPort,
};

const prefix = '{bullmq}';

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

let flowProducer;
let emailQueue;

/**
 *
 * @param name Unique name of the queue
 * @param processor
 */
export function registerQueue<T>(name: string, processor: Processor<T>) {
    if (!registeredQueues[name]) {
        const queue = new Queue(name, { connection, prefix });
        const queueEvents = new QueueEvents(name, {
            connection,
            prefix
        });
        const worker = new Worker<T>(name, processor, {
            connection,
            prefix,
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

export type Email = {
    credentialId?: string;
    to: string;
    from?: string;
    subject: string;
    text?: string;
    html?: string;
};

export const sendEmails = async (
    req: PayloadRequest,
    batchId: string,
    emails: Email[],
    collection: 'credential' | 'membership' = 'credential'
) => {
    initializeQueues(req);
    return flowProducer.add({
        name: `send-emails-for-${batchId}`,
        queueName: 'emailsFinished',
        data: { batchId, collection },
        children: emails.map(email => ({
            name: email.credentialId || email.to,
            queueName: 'email',
            data: { email, collection },
        })),
    });
};

export const sendSingleEmail = async (req: PayloadRequest, email: Email, collection: 'credential' | 'membership' = 'credential') => {
    initializeQueues(req);
    emailQueue.add('send-test-email', { email, collection });
};

const initializeQueues = (req: PayloadRequest) => {
    if (!flowProducer) {
        flowProducer = new FlowProducer({ connection, prefix });
    }

    if (!emailQueue) {
        // This will run in the same thread as the main app
        // if this is more processor intensive then we should offload this to a background process
        /*
        "If we pass a path to a javascript file instead of a function to 
        the registerQueue function, BullMQ will spawn a new process to run the file. 
        These are called sandboxed processors."
        */
        emailQueue = registerQueue(
            'email',
            async (job: Job<{ email: Email; collection: 'credential' | 'membership' }>) => {

                const { to, from, subject, text, html, credentialId } = job.data.email;

                const emailFromTitle = from || process.env.EMAIL_FROM_TITLE || 'LearnCloud';
                const _from = `${emailFromTitle} <${process.env.EMAIL_FROM_SENDER ?? 'no-reply@learncloud.ai'}>`;
                console.log("[Send Email - Credential]: ", to, _from, credentialId);
                await payload.sendEmail({
                    to,
                    subject,
                    text,
                    html,
                    from: _from,
                });

                if (credentialId) {
                    await payload.update({
                        collection: job.data.collection,
                        id: credentialId,
                        data: { status: CREDENTIAL_STATUS.SENT },
                        req
                    });
                }
            }
        );
    }

    if (!registeredQueues['emailsFinished']) {
        registerQueue(
            'emailsFinished',
            async (job: Job<{ batchId: string; collection: 'credential' | 'membership' }>) => {
                console.log("[Email Finished - Batch]: ", batchId, collection);

                return payload.update({
                    collection:
                        job.data.collection === 'credential'
                            ? 'credential-batch'
                            : 'membership-batch',
                    id: job.data.batchId,
                    data: { status: CREDENTIAL_BATCH_STATUS.SENT },
                    req
                });
            }
        );
    }
};