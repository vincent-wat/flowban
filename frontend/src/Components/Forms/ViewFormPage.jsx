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
    
            // Log all available PDF fields
            console.log("Available Fields in PDF:");
            const fields = form.getFields();
            fields.forEach((field) => {
                console.log(`Field Name: ${field.getName()}, Field Type: ${field.constructor.name}`);
            });
    
            // Log DOM inputs and their attributes
            console.log("DOM Inputs:");
            const inputs = document.querySelectorAll(".pdfViewer input");
            inputs.forEach((input) => {
                console.log(`DOM Input Name: ${input.name}, Value: ${input.value}, Data ID: ${input.dataset.elementId}`);
            });
    
            // Attempt to map DOM inputs to PDF fields
            inputs.forEach((input) => {
                const fieldName = input.name; // Use the 'name' attribute to match PDF fields
                const fieldValue = input.value;
    
                try {
                    const field = form.getField(fieldName);
                    if (field) {
                        if (field.constructor.name === "PDFTextField") {
                            console.log(`Setting text for ${fieldName}: ${fieldValue}`);
                            field.setText(fieldValue); // Set text for text fields
                        } else if (field.constructor.name === "PDFCheckBox") {
                            if (input.checked) {
                                console.log(`Checking ${fieldName}`);
                                field.check(); // Check the checkbox
                            } else {
                                console.log(`Unchecking ${fieldName}`);
                                field.uncheck(); // Uncheck the checkbox
                            }
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
    
            // Upload the new file
            const formData = new FormData();
            formData.append("modifiedPdf", new Blob([pdfBytes]), `form_${Date.now()}.pdf`);
            formData.append("template_id", templateId);
            formData.append("submitted_by", "11");
    
            const response = await fetch("http://localhost:3000/api/formInstance/Instances", {
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
