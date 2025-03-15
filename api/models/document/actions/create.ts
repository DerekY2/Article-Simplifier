import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossUserDataAccess } from "gadget-server/auth";
import pdfParse from "pdf-parse";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  
  // Check if a PDF file was uploaded
  if (record.pdfFile && record.pdfFile.url) {
    try {
      // Download the PDF file content
      const response = await fetch(record.pdfFile.url);
      const pdfArrayBuffer = await response.arrayBuffer();
      const pdfBuffer = Buffer.from(pdfArrayBuffer);
      
      // Extract text from the PDF using pdf-parse
      const pdfData = await pdfParse(pdfBuffer);
      
      // Set the extracted text to the record's content field
      record.content = {
        markdown: pdfData.text || "No text extracted from PDF"
      };
      
      logger.info(`Extracted ${pdfData.text.length} characters from PDF: ${record.pdfFile.fileName}`);
    } catch (error) {
      logger.error("Error extracting text from PDF", { error });
      // Still continue with the upload even if text extraction fails
    }
  }
  
  await preventCrossUserDataAccess(params, record);
  await save(record);
};

export const options: ActionOptions = {
  actionType: "create",
};
