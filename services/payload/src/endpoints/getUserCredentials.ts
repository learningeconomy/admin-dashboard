import payload from 'payload';
import { PayloadHandler } from 'payload/config';

export const getUserCredentials: PayloadHandler = async (req, res) => {
    const email = req.body.email;

    const credential = await payload.find({
        collection: 'credential',
        where: { emailAddress: { equals: email } },
        depth: 0,
    });

    const credentialIds = credential.docs.map(doc => doc.id);

    res.status(200).json(credentialIds);
};
