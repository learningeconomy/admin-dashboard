import { PayloadHandler } from "payload/config";
import { Forbidden } from "payload/errors";
import payload from "payload";

export const sendTestEmail: PayloadHandler = async (req, res, next) => {
  if (!req.user) throw new Forbidden();
   console.log('////req?.body', req.body);
  const query = {
    batch: {
      equals: req?.body?.message
    }
  }

  try {
    console.log("//req body", req?.body);
    const data = await payload.sendEmail({
        to: 'withallmyhrt@gmail.com',
        subject: 'test email payload',
        email: 'test email',
    })
   
    console.log('///data found', data);

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
