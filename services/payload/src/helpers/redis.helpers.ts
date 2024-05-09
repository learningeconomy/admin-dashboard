import Redis from 'ioredis';

const host = process.env.REDIS_URL ?? 'localhost';
const port = Number(process.env.REDIS_PORT ?? '6379');

let redis;

export const getRedis = () => {
	if(!redis) redis = new Redis({ host, port });
	return redis;
};

export default getRedis;
