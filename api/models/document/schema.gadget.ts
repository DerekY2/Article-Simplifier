import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "document" model, go to https://article-simplifier.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "254dU4CSu6Gu",
  comment:
    "This model represents a PDF document uploaded by a user, storing its metadata and content.",
  fields: {
    content: { type: "richText", storageKey: "p7_kuUh6LgJS" },
    description: { type: "string", storageKey: "HZX0o0XuCn8-" },
    pdfFile: {
      type: "file",
      allowPublicAccess: false,
      validations: { required: true },
      storageKey: "U3SUuHnr6tWB",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "D12WK_vEyIWb",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "LriGZCJ3nyYA",
    },
  },
};
