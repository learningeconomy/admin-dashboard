import { PayloadHandler } from "payload/config";
import { Forbidden } from "payload/errors";
import payload from "payload";
import { emailQueue } from "../jobs/queue.server";
import { generateJwtFromId } from "../helpers/jwtHelpers";

export const sendBatchEmail: PayloadHandler = async (req, res, next) => {
  if (!req.user) throw new Forbidden();
   console.log('////req?.body', req.body);
  //get batch id
   const batchId = req?.body?.batchId;

   // get all credentials records associated with batchId
  const query = {
    batch: {
      equals: req?.body?.message
    }
  }

  //get all emails from credential records
  

  //generate email link
  // use id from credential record to generate jwt
  const _id = 'test';

  const jwt = await generateJwtFromId(_id);


  // test email

  // get email template for batch


  try {
    console.log("//req body", req?.body);

    const data = {
      to: 'withallmyhrt@gmail.com',
      subject: 'test email payload',
      email: 'test email',
      html: '<p>hello world</p>'
    };


    await emailQueue.add("send-test-email", data)

    //actual email
    // get credential details and interpolate into email template
    // queue up email jobs
   
    console.log('///data found', data);

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
