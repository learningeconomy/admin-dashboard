import { PayloadHandler } from 'payload/config';
import jwt from 'jsonwebtoken';

const secret =
    process.env.PAYLOAD_SECRET ??
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa';

import { exchange } from '../helpers/issuerCoordinator';

const logs = true;

export const forwardExchangeRequest: PayloadHandler = async (req, res) => {
    // A = retrievalId
    // B = challenge
    const { a, b, token } = req.params;
    let id: string;
    let collection: 'credential' | 'membership';

    if (logs) console.log('[Forward Exchange Request] Request: ', a, b, token);

    try {
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === 'string' || !decoded.id) return res.sendStatus(401);

        id = decoded.id;
        collection = decoded.collection || 'credential';
    } catch (error) {
        return res.sendStatus(401);
    }

    if (logs) console.log('[Forward Exchange Request] Decoded: ', id, collection);

    const statusCodeOrVC = await exchange(req, collection, id, a, b, req.body);
    if (logs) console.log('[Forward Exchange Request] Status Code:', statusCodeOrVC);

    if (typeof statusCodeOrVC === 'number') {
        return res.sendStatus(statusCodeOrVC);
    }

    return res.json(statusCodeOrVC);
};