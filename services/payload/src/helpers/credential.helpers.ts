export const AUTOMATIC_FIELDS = ['earnerName', 'credentialName', 'emailAddress', 'now'];

export const objectWithoutKey = (object, key) => {
    const { [key]: deletedKey, ...otherKeys } = object;
    return { otherKeys, deletedKey };
};
