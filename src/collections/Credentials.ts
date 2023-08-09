import { CollectionConfig } from "payload/types";
import CreateBatch from "../components/flows/CreateBatch";

const CredentialsCollection: CollectionConfig = {
  slug: "credential",
  admin: {
    defaultColumns: ["credentialName", "id", "status"],
    useAsTitle: "credentialName",
    components: {
      views: {
        Edit: CreateBatch,
      },
    }
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "credentialName",
      type: "text",
    },
    {
      name: "earnerName",
      type: "text",
    },
    {
      name: "emailAddress",
      type: "email",
    },
    {
      name: "extraFields",
      type: "json",
      required: false,
    },
    {
      name: "status",
      type: "text",
      required: true,
      defaultValue: "DRAFT",
      admin: { hidden: true },
    },
    {
      name: "batch",
      type: "relationship",
      required: true,
      relationTo: "credential-batches",
      hasMany: false,
    },
  ],
};

export default CredentialsCollection;
