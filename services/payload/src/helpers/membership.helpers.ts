import payload from 'payload';

const getTemplateAssociatedWithMembership = async (membershipId: string) => {
    const membershipCredential = (
        await payload.find({
            collection: 'membership',
            where: { id: { equals: membershipId } },
            depth: 0,
        })
    ).docs?.[0];

    if (membershipCredential) {
        const membershipBatch = (
            await payload.find({
                collection: 'membership-batch',
                where: { id: { equals: membershipCredential?.batch } },
                depth: 0,
            })
        ).docs?.[0];

        if (membershipBatch) {
            return payload.find({
                collection: 'membership-template',
                where: { id: { equals: membershipBatch?.template } },
                depth: 0,
            });
        }
    }
};

export default getTemplateAssociatedWithMembership;