import { PayloadHandler } from 'payload/config';

export const readPayloadVersion: PayloadHandler = (req, res) => {
    try {
        let version = '1.00';

        res.status(200).json({
            version: version,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ version: undefined });
    }
};
