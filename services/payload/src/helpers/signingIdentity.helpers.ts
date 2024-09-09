import crypto from 'crypto';
import type { PayloadRequest } from 'payload/dist/types'
import type { Tenant } from '../payload-types';
import { initLearnCard, NetworkLearnCardFromSeed } from '@learncard/init';
import { LearnCard, JWE, UnsignedVC, VC } from '@learncard/types';

import { getLearnCard as getRootLearnCard } from './learncard.helpers';

export type SigningIdentity = {
    did: string;
    encryptedSecret: JWE;
    encryptionKeyVersion: string;
};

export const generateJWE = async (
    learnCard: LearnCard,
    recipientDid: string,
    item: any
): Promise<JWE> => {
    return learnCard.invoke.getDIDObject().createDagJWE(item, [learnCard.id.did(), recipientDid]);
};

export const decryptJWE = async <T>(learnCard: LearnCard, jwe: JWE): Promise<T> => {
    return learnCard.invoke.getDIDObject().decryptDagJWE(jwe) as any;
};

export const generateSecureSeedPhrase = async () => {
    return crypto.randomBytes(32).toString('hex');
};

export const createSecretPhraseVC = (seed: string, did: string): any => {
    return {
        '@context': [
            'https://www.w3.org/2018/credentials/v1',
            {
                'type': '@type',
                'xsd': 'https://www.w3.org/2001/XMLSchema#',
                'lcn': 'https://docs.learncard.com/definitions#',
                'SecretPhraseCredential': {
                    '@id': 'lcn:secretPhraseCredential',
                    '@context': {
                        'secret': {
                            '@id': 'lcn:secret',
                            '@type': 'xsd:string',
                        },
                    },
                },
            },
        ],
        'type': ['VerifiableCredential', 'SecretPhraseCredential'],
        'issuanceDate': new Date().toISOString(),
        'credentialSubject': {
            'id': did,
        },
        'secret': seed,
    };
};

export const generateEncryptedSigningIdentity = async (): Promise<SigningIdentity> => {
    const rootLearnCard = await getRootLearnCard();

    const seed = await generateSecureSeedPhrase();
    const tenantLc = await initLearnCard({ network: true, seed });
    const tenantLcDID = tenantLc.id.did();
    const unsignedSecretVC = createSecretPhraseVC(seed, rootLearnCard.id.did(), tenantLcDID);
    const signedSecretVc = await rootLearnCard.invoke.issueCredential(unsignedSecretVC);
    const encryptedSecret = await generateJWE(rootLearnCard, tenantLcDID, signedSecretVc);
    return {
        did: tenantLcDid,
        encryptedSecret,
        encryptionKeyVersion: rootLearnCard.id.did(),
    };
};

export const getSecretFromEncryptedSecretPhraseVC = async (
    encryptedSecretPhraseVC: string
): Promise<string> => {
    const rootLearnCard = await getRootLearnCard();
    const decrypted = await decryptJWE(rootLearnCard, encryptedSecretPhraseVC);
    return decrypted?.secret;
};


export const issueCredentialViaTenantIdentity = async (tenant: string | Tenant, credential: UnsignedVC, req: PayloadRequest): Promise<VC> => {
    const tenantId = typeof tenant === 'string' ? tenant : tenant.id;
    const tenantLC = await getSigningLearnCardForTenantId(tenantId, req);
    if (typeof credential?.issuer === 'string') credential.issuer = {};
    credential.issuer.id = tenantLC.id.did();
    return tenantLC.issueCredential(credential);
}

export const getSigningLearnCardForTenantId = async (tenantId: string, req: PayloadRequest): Promise<LearnCard | undefined> => {
       const signingIdentities = await req?.payload.find({
            collection: 'signing-identities',
            where: {
                tenant: {
                    equals: tenantId,
                },
            },
            depth: 0,
            limit: 1,
            req,
        });

        if (signingIdentities.totalDocs > 0) {
            const signingIdentity = signingIdentities.docs[0];
            const seed = await getSecretFromEncryptedSecretPhraseVC(signingIdentity.encryptedSecret); 
            return initLearnCard({ network: true, seed });
        } 
}



