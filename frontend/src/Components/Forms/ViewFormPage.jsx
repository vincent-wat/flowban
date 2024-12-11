import React from "react";
import { useParams } from "react-router-dom";
import PdfViewer from "./PdfViewer"; 
import "./pdfViewer.css";

const ViewFormPage = () => {
    const { templateId } = useParams();
    const pdfUrl = `http://localhost:3000/api/forms/templates/pdf/${templateId}`;

    return (
        <div className="page-container"> 
            <h1 className="page-title">View/Edit Form</h1> 
            <PdfViewer fileUrl={pdfUrl} />
        </div>
    );
};

export default ViewFormPage;
