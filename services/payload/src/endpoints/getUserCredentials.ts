import { PayloadHandler } from 'payload/config';

export const getUserCredentials: PayloadHandler = (req, res) => {
    res.status(200).json({
        heyooooo: 'Live Long and Prosper 🖖',
    });
};
