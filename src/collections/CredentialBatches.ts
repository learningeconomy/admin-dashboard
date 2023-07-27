import { CollectionConfig } from "payload/types";

const CredentialsBatchesCollection: CollectionConfig = {
  slug: "credential-batches",
  admin: {
    defaultColumns: ["title", "id", "status"],
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    {
      name: "description",
      type: "textarea",
      required: false,
      maxLength: 1000,
    },
    {
      name: "internalNotes",
      type: "textarea",
      required: false,
      maxLength: 1000,
    },
    {
      name: "status",
      type: "text",
      required: true,
      defaultValue: 'DRAFT',
      admin: { hidden: true },
    },
    {
      name: "template",
      type: "relationship",
      required: true,
      relationTo: "credential-templates",
      hasMany: false,
    },
  ],
};

export default CredentialsBatchesCollection;
