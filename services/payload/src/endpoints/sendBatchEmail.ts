import { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import payload from 'payload';
import { emailQueue } from '../jobs/queue.server';
import { generateJwtFromId } from '../helpers/jwtHelpers';
import Handlebars from 'handlebars';

export const sendBatchEmail: PayloadHandler = async (req, res, next) => {
    if (!req.user) throw new Forbidden();
    console.log('////req?.body', req.body);
    //get batch id
    const batchId = req?.body?.batchId;
    const emailTemplateId = req?.body?.emailTemplateId;

    console.log('//emailTemplateId', emailTemplateId);

    if (!batchId || !emailTemplateId) return res.sendStatus(400);
    //get email template for batch
    const emailTemplateRecord = await payload.findByID({
        collection: 'email-template',
        id: emailTemplateId,
        depth: 2,
        showHiddenFields: true,
        locale: 'en',
    });

    console.log('///emailTemplateRecord', emailTemplateRecord);

    // email template code
    const emailTemplate = emailTemplateRecord?.emailTemplatesHandlebarsCode;
    if (!emailTemplate) return res.sendStatus(500);

    console.log('///emailTemplate', emailTemplate);

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
        where: { ...query }, // pass a `where` query here
        sort: '-title',
        locale: 'en',
    });

    const handlebarsTemplate = Handlebars.compile(emailTemplate);

    //for each record, generate email link and queue up email to be sent

    const emails = data?.docs?.map(record => {
        const jwt = generateJwtFromId(record?.id);
        const link = `https://localhost:4321/?token=${jwt}`;
        // replace handlebar variables in email template with record data
        const mergedRecordWithLink = { ...record, link };
        const parsedHtml = handlebarsTemplate(mergedRecordWithLink);
        return {
            to: record?.emailAddress,
            subject: emailTemplateRecord?.emailSubjectTitle || 'Claim Credential',
            email: 'test email2',
            html: `${parsedHtml}`,
        };
    });

    console.log('///email map', emails);

    // get email template for batch and insert data into template

    try {
        // send emails to email queue
        emails?.forEach(email => {
            console.log('///emailsData', email);
            emailQueue.add('send-test-email', email);
        });

        console.log('///all emails', emails);

        res.status(200).json({ emails });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
