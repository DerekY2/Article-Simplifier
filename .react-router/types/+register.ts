import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/forgot-password": {};
  "/reset-password": {};
  "/verify-email": {};
  "/sign-in": {};
  "/sign-up": {};
  "/create-simplification/:documentId": {
    "documentId": string;
  };
  "/enhanced-documents": {};
  "/documents": {};
  "/signed-in": {};
  "/profile": {};
};