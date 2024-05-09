import crypto from 'crypto';
import getRedis from '../../../helpers/redis.helpers';

const COORDINATOR_CHALLENGE_PREFIX = 'coordinator-challenge:';

export const getChallengeURI = (challenge: string) => `${COORDINATOR_CHALLENGE_PREFIX}${challenge}`;

export const generateAndStoreChallengeForCredentialId = async (id: string) => {
    const challenge = crypto.randomBytes(32).toString('hex');

    const redis = getRedis();
    await redis.setex(getChallengeURI(challenge), 3600, id);
    return challenge;
};

export const getDelCredentialIdForChallenge = async (challenge: string) => {
    const redis = getRedis();
    const challengeStoredForCredential = await redis.getdel(getChallengeURI(challenge));
    return challengeStoredForCredential;
};