import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import jwt from 'jsonwebtoken';
import { insertValuesIntoHandlebarsJsonTemplate } from '../helpers/handlebarhelpers';

const secret =
    process.env.PAYLOAD_SECRET ??
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa';
const expires = process.env.TOKEN_EXPIRATION_TIME_IN_SECONDS;

export const getCredential: PayloadHandler = async (req, res) => {
    // TODO: Auth
    const authHeader = req.headers.authorization;
    const { id } = req.query;

    if (!id || typeof id !== 'string') return res.sendStatus(400);

    try {
        if (!authHeader.startsWith('Bearer ')) return res.sendStatus(401);

        const token = authHeader.split('Bearer ')[1];

        const decoded = jwt.verify(token, secret);

        if (typeof decoded === 'string' || decoded.id !== id) return res.sendStatus(401);
    } catch (error) {
        return res.sendStatus(401);
    }

    try {
        const credential = await payload.findByID({
            id,
            collection: 'credential',
            depth: 3,
        });

        console.log({ credential });

        if (!credential?.batch?.template?.credentialTemplateJson) return res.sendStatus(404);

        const builtCredential = insertValuesIntoHandlebarsJsonTemplate(
            JSON.stringify(credential.batch.template.credentialTemplateJson),
            {
                ...credential.extraFields,
                credentialName: credential.credentialName,
                earnerName: credential.earnerName,
                emailAddress: credential.emailAddress,
                now: new Date().toISOString(),
                issuanceDate: credential.updatedAt,
            }
        );

        if (typeof builtCredential?.issuer === 'string') builtCredential.issuer = {};
        if ('id' in (builtCredential?.issuer ?? {})) delete builtCredential.issuer.id;

        res.status(200).json(builtCredential);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const getCredentialJwt: PayloadHandler = async (req, res) => {
    // TODO: Auth
    const { id } = req.query;

    if (!id || typeof id !== 'string') return res.sendStatus(400);

    try {
        const token = jwt.sign({ id }, secret, { ...(expires && { expiresIn: expires }) });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
