import express from 'express';
import payload from 'payload';
import path from 'path';

import { seed } from './seed'

import 'dotenv/config';
const app = express();

app.use('/assets', express.static(path.resolve(__dirname, './assets')));
// Redirect root to Admin panel
app.get('/', (_, res) => {
    res.redirect('/admin');
});

const start = async () => {
    // Initialize Payload
    await payload.init({
        secret: process.env.PAYLOAD_SECRET,
        // mongoURL: process.env.MONGODB_URI,
        express: app,
        onInit: async () => {
            payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
        },
    });

    // Add your own express routes here
    // if (process.env.PAYLOAD_SEED === 'true') {
    //     payload.logger.info('---- SEEDING DATABASE ----')
    //     await seed(payload)
    // }

    app.listen(process.env.PORT || 3000);

    console.log('Listening on port', process.env.PORT || 3000);
};

start();
