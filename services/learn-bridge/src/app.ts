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
    const test = await fetch('http://localhost:3000/api/get-user-credentials');

    console.log('🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆');
    console.log('test:', await test.text());

    return res.status(200).json({ message: 'Alive!' });

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
