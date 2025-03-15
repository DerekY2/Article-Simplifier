import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "textExplanation" model, go to https://article-simplifier.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "sTXUhhkZEqxM",
  comment:
    "Model to store AI-generated explanations for selected text from documents, including the source document, selected text, explanation, and requesting user",
  fields: {
    document: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "document" },
      storageKey: "9hbDDye8EJGE",
    },
    explanation: { type: "richText", storageKey: "lanIG6O9-S-c" },
    selectedText: {
      type: "string",
      validations: { required: true },
      storageKey: "fKYUzHNAuYpg",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "Y2DL0LfnkZmk",
    },
  },
};
