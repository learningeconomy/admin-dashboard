import { PayloadHandler } from "payload/config";
import { Forbidden } from "payload/errors";
import payload from "payload";

export const getBatchCredentials: PayloadHandler = async (req, res, next) => {
  if (!req.user) throw new Forbidden();

  const query = {
    batch: {
      equals: '64ee3ec5a0c9315b8536cc1a'
    }
  }

  try {
    console.log("//req body", req?.body);
    const data = await payload.find({
      collection: "credential", // required
      depth: 2,
      page: 1,
      limit: 10,
      where: { ...query }, // pass a `where` query here
      sort: "-title",
      locale: "en",
    });
    console.log("///get CRED BATCH ENDPOINT", res);

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ version: undefined });
  }
};
