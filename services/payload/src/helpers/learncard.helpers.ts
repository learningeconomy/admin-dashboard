import { initLearnCard, NetworkLearnCardFromSeed } from '@learncard/init';

let learnCard: NetworkLearnCardFromSeed['returnValue'] | undefined;

export const getLearnCard = async () => {
    if (!learnCard) learnCard = await initLearnCard({ network: true, seed: process.env.LC_SEED! });

    return learnCard!;
};

export const areDidsEqual = async (did1: string, did2: string) => {
    if (did1 === did2) return true;

    const lc = await getLearnCard();

    const [resolvedDid1, resolvedDid2] = await Promise.all([
        lc.invoke.resolveDid(did1),
        lc.invoke.resolveDid(did2),
    ]);

    return resolvedDid1?.verificationMethod?.some(method1 => {
        return resolvedDid2?.verificationMethod?.some(
            method2 => method1?.publicKeyJwk?.x === method2?.publicKeyJwk?.x
        );
    });
};
