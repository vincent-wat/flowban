import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfViewer = ({ fileUrl }) => {
    return (
        <div
            style={{
                height: "calc(100vh - 60px)", // Full height minus navbar height
                width: "100%",              // Full width of the screen
                overflow: "auto",           // Scrollable content
            }}
        >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} defaultScale={1.5} />
            </Worker>
        </div>
    );
};

export default PdfViewer;
