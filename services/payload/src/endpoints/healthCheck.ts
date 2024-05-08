import { PayloadHandler } from 'payload/config';

// Health Check for Server
export const healthCheck: PayloadHandler = async (req, res) => {
    res.sendStatus(200);
};


