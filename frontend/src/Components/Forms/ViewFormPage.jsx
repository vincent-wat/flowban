import React from "react";
import { useParams } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import PdfViewer from "./PdfViewer";
import "./pdfViewer.css";

const ViewFormPage = () => {
  const { templateId } = useParams();
  const pdfUrl = `https://localhost:3000/api/forms/templates/pdf/${templateId}`;

  const handleSubmit = async () => {
    try {
      console.log("[handleSubmit] Fetching PDF from URL:", pdfUrl);

      // 1. Fetch the PDF data
      const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());

      // 2. Load it into pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      console.log("[handleSubmit] Loaded PDFDocument into pdf-lib. Form object:", form);

      // 3. Log all fields in the PDF (AcroForm)
      console.log("[handleSubmit] Available AcroForm Fields in PDF:");
      form.getFields().forEach((field) => {
        console.log(
          `  Field Name: "${field.getName()}", Field Type: ${field.constructor.name}`
        );
      });

      // 4. Gather all DOM inputs that pdf.js is rendering
      const inputs = document.querySelectorAll(".pdfViewer input");
      console.log("[handleSubmit] DOM Inputs found in .pdfViewer:", inputs);

      // 5. For each DOM <input>, attempt to set the corresponding PDF field
      inputs.forEach((input) => {
        const fieldName = input.name;
        const fieldValue = input.value;
        console.log(`\n[handleSubmit] DOM input => name: "${fieldName}", value: "${fieldValue}"`);

        try {
          const field = form.getField(fieldName);

          if (field) {
            const fieldType = field.constructor.name;
            console.log(`  => Found PDF field "${fieldName}" [${fieldType}].`);

            if (fieldType === "PDFTextField") {
              console.log(`  => Setting text for "${fieldName}" to: "${fieldValue}"`);
              field.setText(fieldValue);
            } else if (fieldType === "PDFCheckBox") {
              console.log(`  => Setting checkbox "${fieldName}" to: ${input.checked}`);
              input.checked ? field.check() : field.uncheck();
            } else {
              console.log(`  => Unhandled field type: ${fieldType}`);
            }
          } else {
            console.log(`  => No matching PDF field found for DOM input: "${fieldName}"`);
          }
        } catch (error) {
          console.error(`  => Error setting PDF field "${fieldName}":`, error);
        }
      });

      // 6. Save the updated PDF bytes
      const pdfBytes = await pdfDoc.save();
      console.log("[handleSubmit] PDF updated, saving bytes...");

      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const fileName = `form_${Date.now()}.pdf`;

      const formData = new FormData();
      formData.append("file", pdfBlob, fileName); 
      formData.append("template_id", templateId);
      formData.append("submitted_by", "19"); // fix for actual id later

      // 8. Submit to your server
      console.log("[handleSubmit] Submitting form data to backend...");
      const response = await fetch("https://localhost:3000/api/formInstance/instances", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("[handleSubmit] Error generating or submitting PDF:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">View/Edit Form</h1>
      <PdfViewer fileUrl={pdfUrl} />
      <button className="submit-button" onClick={handleSubmit}>
        Submit Form
      </button>
    </div>
  );
};

export default ViewFormPage;
