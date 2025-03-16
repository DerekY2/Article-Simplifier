import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, logger, api, session }) => {
  // Check if user is signed in
  if (!session || !session.get("user")) {
    throw new Error("You must be signed in to generate a PDF upload token");
  }

  // Generate a direct upload token
  const { url, token } = await api.getDirectUploadToken();

  // Return the upload URL and token
  return {
    uploadUrl: url,
    token: token
  };
};

export const options: ActionOptions = {
  returnType: true,
  // Ensure only signed-in users can run this action
  triggers: { api: true }
};