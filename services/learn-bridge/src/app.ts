import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

import { TypedRequest } from './types.helpers';
import { IssueEndpoint } from './validators';

const router = express.Router();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health-check', async (req: TypedRequest<{}>, res) => {
    const email = 'beeston.taylor@gmail.com';

    const idResponse = await fetch('http://localhost:3000/api/get-user-credentials', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    const ids = await idResponse.json();

    const credResponse = await fetch('http://localhost:3000/api/get-credentials-links', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
    });

    const credentials = await credResponse.json();

    return res.status(200).json(credentials);
});

app.post('/get-user-credentials-by-email', async (req: TypedRequest<{ email: string }>, res) => {
    const email = req.body.email;

    console.log('🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆🎆 LearnBridge!');

    const test = await fetch('http://localhost:3000/api/get-user-credentials', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    return res.status(200).json(await test.json());
});

app.get('/list', async (req: TypedRequest<{}>, res) => {
    return res.status(200).json([1, 2, 3]);
});

app.post('/issue', async (req: TypedRequest<IssueEndpoint>, res) => {
    return res.status(200).json({ name: 'dummy cred' });
});

app.use('', router);

export default app;
