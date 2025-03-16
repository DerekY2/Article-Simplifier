import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "enhancedDocument" model, go to https://article-simplifier.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "5lUdWeDWOfl0",
  comment:
    "The enhancedDocument model stores AI-processed versions of documents, including extracted key points, highlights, and notes, and is used to provide users with enhanced document viewing capabilities.",
  fields: {
    highlights: { type: "json", storageKey: "fMybY2OJaJE_" },
    notes: {
      type: "richText",
      validations: { required: true },
      storageKey: "eT6i7ktZ7x-o",
    },
    originalDocument: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "document" },
      storageKey: "0DSXK6Qr-3R6",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "32lxvzF8uPEk",
    },
  },
};
