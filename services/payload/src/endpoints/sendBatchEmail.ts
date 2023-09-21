import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';
import { emailQueue } from '../jobs/queue.server';
import { generateJwtFromId } from '../helpers/jwtHelpers';

export const sendBatchEmail: PayloadHandler = async (req, res, next) => {
    if (!req.user) throw new Forbidden();
    console.log('////req?.body', req.body);
    //get batch id
    const batchId = req?.body?.batchId;

    if (!batchId) throw new Error('No batchId provided. Batch id is required.');
    //get batch so we can get email template associated with it
    const batchInfo = await payload.findByID(({
      collection: "credential-batch",
      id: batchId,
      locale: "en",
    }))

    console.log('///batchInfo', batchInfo);

    // get all credentials records associated with batchId
    const query = {
        batch: {
            equals: batchId,
        },
    };

    console.log('//req body', req?.body);
    const data = await payload.find({
        collection: 'credential', // required
        depth: 2,
        page: 1,
        limit: 10,
        where: { ...query }, // pass a `where` query here
        sort: '-title',
        locale: 'en',
    });

    console.log('///credential data found query', data);

    //for each record, generate email link and queue up email to be sent

    const emails = data?.docs?.map(record => {
        const jwt = generateJwtFromId(record?.id);
        const link = `https://localhost:4321/?token=${jwt}`;
        return {
            to: record?.emailAddress,
            subject: 'test email payload',
            email: 'test email',
            html: `<p>hello world <a href="${link}">${link}</a></p>`,
        };
    });

    console.log('///email map', emails);

    // get email template for batch and insert data into template

    try {
        console.log('//req body', req?.body);

        // const data = {
        //   to: 'withallmyhrt@gmail.com',
        //   subject: 'test email payload',
        //   email: 'test email',
        //   html: '<p>hello world</p>'
        // };
        emails?.forEach(email => {
          console.log('///emailsData', email);
            emailQueue.add('send-test-email', email);
        });

        // await emailQueue.add("send-test-email", data)

        //actual email
        // get credential details and interpolate into email template
        // queue up email jobs

        console.log('///all emails', emails);

        res.status(200).json({ emails });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
