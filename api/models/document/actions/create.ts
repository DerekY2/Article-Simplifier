import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossUserDataAccess } from "gadget-server/auth";
import pdfParse from "pdf-parse";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  // Check if a PDF file was uploaded
  if (params.document?.pdfFile?.url) {
    try {
      // Download the PDF file content
      const response = await fetch(params.document.pdfFile.url);
      const pdfArrayBuffer = await response.arrayBuffer();
      const pdfBuffer = Buffer.from(pdfArrayBuffer);
      
      // Extract text from the PDF using pdf-parse
      const pdfData = await pdfParse(pdfBuffer);

      logger.info(`pdfData: ${pdfData}`)
      
          // Set the extracted text to params so applyParams can properly handle the RichText field
      params.document = params.document || {};
      params.document.content = {
        markdown: pdfData.text || "No text extracted from PDF"
      };
      
      logger.info(`Extracted ${pdfData.text.length} characters from PDF: ${record.pdfFile.fileName}; full text: ${pdfData.text}`);
    } catch (error) {
      logger.error("Error extracting text from PDF", { error });
      // Still continue with the upload even if text extraction fails
    }
  }
  
  // Apply params after potentially modifying them with PDF content
  applyParams(params, record);
  
  await preventCrossUserDataAccess(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
