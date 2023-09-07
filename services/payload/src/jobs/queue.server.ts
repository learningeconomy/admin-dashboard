import type { Processor } from "bullmq";
import { QueueEvents } from "bullmq";
import { Queue, Worker } from "bullmq";
import payload from "payload";


// redis settings...
const connection = {
  host: 'localhost',
  port: 6379
}

type AugmentedQueue<T> = Queue<T> & {
  events: QueueEvents
}
type RegisteredQueue = {
  queue: Queue
  queueEvents: QueueEvents
  worker: Worker
}
declare global {
  var __registeredQueues:
    | Record<string, RegisteredQueue>
    | undefined
}
const registeredQueues =
  global.__registeredQueues ||
  (global.__registeredQueues = {})
/**
 *
 * @param name Unique name of the queue
 * @param processor
 */
export function registerQueue<T>(
  name: string,
  processor: Processor<T>,
) {
  if (!registeredQueues[name]) {
    const queue = new Queue(name, { connection })
    const queueEvents = new QueueEvents(name, {
      connection,
    })
    const worker = new Worker<T>(name, processor, {
      connection,
      lockDuration: 1000 * 60 * 15,
      concurrency: 8,
    })
    registeredQueues[name] = {
      queue,
      queueEvents,
      worker,
    }
  }
  const queue = registeredQueues[name]
    .queue as AugmentedQueue<T>
  queue.events = registeredQueues[name].queueEvents
  return queue
}
export const emailQueue = registerQueue(
  "email",
  async (job: any) => {
    const { to, subject, text } = job.data
    await payload.sendEmail({to, subject, text})
  },
)
