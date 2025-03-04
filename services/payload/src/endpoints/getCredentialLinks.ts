import { PayloadHandler } from 'payload/config';
import getDomainForRequest from '../utils/getDomainForRequest';

import { getCredentialLinks as _getCredentialLinks } from '../helpers/issuerCoordinator';

import jwt from 'jsonwebtoken';

const secret =
    process.env.PAYLOAD_SECRET ??
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa';

const tenantName = process.env.TENANT_NAME ?? 'test';

const logs = true;

export const getCredentialLinks: PayloadHandler = async (req, res) => {
    let id: string;
    let collection: 'credential' | 'membership';

    if (logs) console.log('[Get Credential Links] GET!');

    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith('Bearer ')) return res.sendStatus(401);

    const token = authHeader.split('Bearer ')[1];

    try {
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === 'string' || !decoded.id) return res.sendStatus(401);

        id = decoded.id;
        collection = decoded.collection || 'credential';

        if (logs) console.log('[Get Credential Links] Decoded JWT: ', decoded);
    } catch (error) {
        return res.sendStatus(401);
    }

    const rootUrl = await getDomainForRequest(req);

    try {
        const credentialLinks = await _getCredentialLinks(req, id, collection, token, rootUrl);
        if (logs) console.log('[Get Credential Links] Credential Links', credentialLinks);

        if (!credentialLinks) {
            return res.sendStatus(404);
        }

        res.status(200).json(credentialLinks);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};