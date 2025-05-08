import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import PdfViewer from "./PdfViewer";
import "./pdfViewer.css";
import api from "../../axios"; 

const ViewFormPage = () => {
  const { templateId } = useParams();
  
  const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const pdfUrl = `${baseURL}/api/forms/templates/pdf/${templateId}`;
  const navigate = useNavigate();
  

  const handleSubmit = async () => {
    try {
      console.log("[handleSubmit] Fetching PDF from URL:", pdfUrl);
      const token = localStorage.getItem("token");
  
      const existingPdfBytes = await fetch(pdfUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch PDF: ${res.status}`);
        }
        return res.arrayBuffer();
      });
  
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
  
      form.getFields().forEach((field) => {
        const inputs = document.querySelectorAll(".pdfViewer input");
        inputs.forEach((input) => {
          if (input.name === field.getName()) {
            const fieldType = field.constructor.name;
            if (fieldType === "PDFTextField") {
              field.setText(input.value);
            } else if (fieldType === "PDFCheckBox") {
              input.checked ? field.check() : field.uncheck();
            }
          }
        });
      });
  
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const fileName = `form_${Date.now()}.pdf`;
  
      const formData = new FormData();
      formData.append("file", pdfBlob, fileName);
      formData.append("template_id", templateId);
  
      console.log("[handleSubmit] Submitting form data to backend...");
      const response = await api.post("/api/formInstance/instances", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
  
      if (response.ok) {
        alert("Form submitted successfully!");
        navigate(`/workflowboard/${templateId}`);
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
