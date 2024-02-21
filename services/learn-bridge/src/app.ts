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

    // Get admin dashboard ids for issued credentials (these aren't real VCs, just ids linking to AD credential templates)
    const idResponse = await fetch('http://localhost:3000/api/get-user-credentials', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const ids = await idResponse.json();

    // now get the credentials from admin dashboard as unsigned VCs
    //   this has all the data that we need for the actual credential, but we need LC to sign them before issuing a real VC
    const credentialResponse = await fetch('http://localhost:3000/api/get-credentials-links', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
    });
    const unsignedVCs = await credentialResponse.json();

    return res.status(200).json(unsignedVCs);
});

app.get('/list', async (req: TypedRequest<{}>, res) => {
    return res.status(200).json([1, 2, 3]);
});

app.post('/issue', async (req: TypedRequest<IssueEndpoint>, res) => {
    return res.status(200).json({ name: 'dummy cred' });
});

app.use('', router);

export default app;
