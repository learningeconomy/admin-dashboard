import { PayloadHandler } from 'payload/config';
import payload from 'payload';
import { insertValuesIntoHandlebarsJsonTemplate } from '../helpers/handlebarhelpers';

export const getCredential: PayloadHandler = async (req, res, next) => {
    // TODO: Auth
    const { id } = req.query;

    if (!id || typeof id !== 'string') return res.sendStatus(400);

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
