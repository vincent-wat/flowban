import React from "react";
import { useParams } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import PdfViewer from "./PdfViewer";
import "./pdfViewer.css";

const ViewFormPage = () => {
    const { templateId } = useParams();
    const pdfUrl = `http://localhost:3000/api/forms/templates/pdf/${templateId}`;

    const handleSubmit = async () => {
        try {
            const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();
    
            // Log available PDF fields
            console.log("Available Fields in PDF:");
            form.getFields().forEach((field) => {
                console.log(`Field Name: ${field.getName()}, Field Type: ${field.constructor.name}`);
            });
    
            // Log DOM inputs and attempt to map them to PDF fields
            const inputs = document.querySelectorAll(".pdfViewer input");
            console.log("DOM Inputs:", inputs);
    
            inputs.forEach((input) => {
                const fieldName = input.name;
                const fieldValue = input.value;
    
                try {
                    const field = form.getField(fieldName);
                    if (field) {
                        if (field.constructor.name === "PDFTextField") {
                            console.log(`Setting text for ${fieldName}: ${fieldValue}`);
                            field.setText(fieldValue);
                        } else if (field.constructor.name === "PDFCheckBox") {
                            input.checked ? field.check() : field.uncheck();
                        }
                    } else {
                        console.log(`No matching PDF field found for DOM field: ${fieldName}`);
                    }
                } catch (error) {
                    console.error(`Error setting field "${fieldName}":`, error);
                }
            });
    
            // Save the updated PDF
            const pdfBytes = await pdfDoc.save();
    
            // Prepare the form data
            const formData = new FormData();
            formData.append("file", new Blob([pdfBytes]), `form_${Date.now()}.pdf`); // ✅ Match the Multer field name
            formData.append("template_id", templateId);
            formData.append("submitted_by", "11"); // Replace with dynamic user ID
    
            // Send the form data to the backend
            const response = await fetch("http://localhost:3000/api/formInstance/instances", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                alert("Form submitted successfully!");
            } else {
                console.error("Error submitting form");
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
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
