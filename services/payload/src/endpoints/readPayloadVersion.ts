import fs from 'fs';
import path from 'path';

import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';

export const readPayloadVersion: PayloadHandler = (req, res, next) => {
    if (!req.user) throw new Forbidden();

    try {
        let version = '1.00';

        res.status(200).json({
            version: version,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ version: undefined });
    }
};
