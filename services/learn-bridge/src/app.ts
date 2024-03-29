import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

import { TypedRequest } from './types.helpers';
import { IssueEndpoint } from './validators';
import { VC } from '@learncard/types';

const router = express.Router();

const app = express();

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000';

app.use(cors());
app.use(express.json());

app.get('/health-check', async (_req: TypedRequest<{}>, res) => {
    const email = 'beeston.taylor@gmail.com';
    const did = 'did:web:network.learncard.com:users:test';

    const idResponse = await fetch(`${PAYLOAD_URL}/api/get-user-credentials`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const ids = await idResponse.json();

    const credResponse = await fetch(`${PAYLOAD_URL}/api/issue-user-credentials`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, email, did }),
    });

    const credentials = await credResponse.json();

    return res.status(200).json(credentials);
});

app.post('/get-user-credentials-by-email', async (req: TypedRequest<{ email: string }>, res) => {
    const email = req.body.email;

    // Get admin dashboard ids for issued credentials (these aren't real VCs, just ids linking to AD credential templates)
    const idResponse = await fetch(`${PAYLOAD_URL}/api/get-user-credentials`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const ids = await idResponse.json();

    // now get the credentials from admin dashboard as unsigned VCs
    //   this has all the data that we need for the actual credential, but we need LC to sign them before issuing a real VC
    const credentialResponse = await fetch(`${PAYLOAD_URL}/api/get-credentials-links`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
    });
    const unsignedVCs = await credentialResponse.json();

    return res.status(200).json(unsignedVCs);
});

app.post('/list', async (req: TypedRequest<{ membership: VC }>, res) => {
    const { membership } = req.body;
    const idResponse = await fetch(`${PAYLOAD_URL}/api/get-user-credentials`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization ?? '',
        },
        body: JSON.stringify({ membership }),
    });

    if (idResponse.status !== 200) {
        res.status(idResponse.status);

        idResponse.body?.pipe(res);

        return;
    }

    return res.status(200).json(await idResponse.json());
});

app.post('/issue', async (req: TypedRequest<IssueEndpoint>, res) => {
    const { ids } = req.body;

    const credResponse = await fetch(`${PAYLOAD_URL}/api/issue-user-credentials`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization ?? '',
        },
        body: JSON.stringify({ ids }),
    });

    if (credResponse.status !== 200) {
        res.status(credResponse.status);

        credResponse.body?.pipe(res);

        return;
    }

    const credentials = await credResponse.json();

    return res.status(200).json(credentials);
});

app.use('', router);

export default app;
