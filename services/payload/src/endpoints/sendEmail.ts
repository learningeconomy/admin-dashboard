import { PayloadHandler } from "payload/config";
import { Forbidden } from "payload/errors";
import payload from "payload";
import { emailQueue } from "../jobs/queue.server.ts";

export const sendEmail: PayloadHandler = async (req, res, next) => {
  if (!req.user) throw new Forbidden();
   console.log('////req?.body', req.body);
  const query = {
    batch: {
      equals: req?.body?.message
    }
  }

  // test email

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
    // send email
   
    console.log('///data found', data);

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
