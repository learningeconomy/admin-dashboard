import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

import { TypedRequest } from './types.helpers';
import { IssueEndpoint } from './validators';

const router = express.Router();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health-check', async (_req: TypedRequest<{}>, res) => {
    const email = 'kyle+kirk@learningeconomy.io';

    const test = await fetch('http://localhost:3000/api/get-user-credentials', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    return res.status(200).json(await test.json());

    /* const learnCard = await getWallet();

    const uvc = learnCard.invoke.getTestVc();
    uvc.issuer = { id: issuerDid };

    const vc = await learnCard.invoke.issueCredential(uvc, { verificationMethod }); */

    // res.status(200).json({ vc, message: 'Alive!' });
});

app.get('/list', async (req: TypedRequest<{}>, res) => {
    return res.status(200).json([1, 2, 3]);
});

app.post('/issue', async (req: TypedRequest<IssueEndpoint>, res) => {
    return res.status(200).json({ name: 'dummy cred' });
});

app.use('', router);

export default app;
