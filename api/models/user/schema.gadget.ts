import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://article-simplifier.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "58ok9Mx-l20n",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "iDUPyrE7RvL7",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "hSsOAk_g1HDk",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "SBiTj0w1sXQI",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "lH1_9iwe3MO2",
    },
    firstName: { type: "string", storageKey: "GaxkDoAjI3cn" },
    googleImageUrl: { type: "url", storageKey: "hGsPG9U1SSN-" },
    googleProfileId: { type: "string", storageKey: "arxnoKDaZjUh" },
    lastName: { type: "string", storageKey: "JT_8FXQOimeN" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "brlhNfF9uczY",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "q7RYYXuoevv0",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "EDsQVA8vg7qW",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "-cPO-A_8a1BB",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "RUWz78I74I58",
    },
  },
};
