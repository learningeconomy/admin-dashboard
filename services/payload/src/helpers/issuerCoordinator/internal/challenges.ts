import crypto from 'crypto';
import redis from '../../../helpers/redis.helpers';

const COORDINATOR_CHALLENGE_PREFIX = 'coordinator-challenge:';

export const getChallengeURI = (challenge: string) => `${COORDINATOR_CHALLENGE_PREFIX}${challenge}`;

export const generateAndStoreChallengeForCredentialId = async (id: string) => {
    const challenge = crypto.randomBytes(32).toString('hex');

    await redis.setex(getChallengeURI(challenge), 3600, id);
    return challenge;
};

export const getDelCredentialIdForChallenge = async (challenge: string) => {
    const challengeStoredForCredential = await redis.getdel(getChallengeURI(challenge));
    return challengeStoredForCredential;
};