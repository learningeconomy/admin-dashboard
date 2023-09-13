import jwt from 'jsonwebtoken';
const secret =
    process.env.PAYLOAD_SECRET ??
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa';
const expires = process.env.TOKEN_EXPIRATION_TIME_IN_SECONDS;

export const generateJwtFromId = async (id: string) => {
    try {
        const token = jwt.sign({ id }, secret, { ...(expires && { expiresIn: expires }) });
        return token;
    } catch (e) {
        throw new Error(e);
    }
};
