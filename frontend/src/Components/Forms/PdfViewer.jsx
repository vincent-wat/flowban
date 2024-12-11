import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // Core PDF.js library
import * as pdfjsViewer from "pdfjs-dist/legacy/web/pdf_viewer"; // PDF.js viewer
import "pdfjs-dist/legacy/web/pdf_viewer.css"; // PDF.js viewer styles

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PdfViewer = ({ fileUrl }) => {
    const viewerContainerRef = useRef(null);

    useEffect(() => {
        const container = viewerContainerRef.current;

        if (!container) {
            console.error("Container for PDFViewer is not found");
            return;
        }

        const eventBus = new pdfjsViewer.EventBus(); // Create an event bus
        const pdfViewer = new pdfjsViewer.PDFViewer({
            container: container, // Assign container ref
            eventBus: eventBus, // Pass the event bus
            enableForms: true, // Enable form rendering
        });

        const loadPdf = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                const pdf = await loadingTask.promise;
                pdfViewer.setDocument(pdf);
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        };

        loadPdf();

        return () => {
            // Cleanup if needed
            pdfViewer.cleanup();
        };
    }, [fileUrl]);

    return (
        <div
            ref={viewerContainerRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "auto",
                height: "100%",
                width: "100%",
            }}
        >
            <div className="pdfViewer"></div>
        </div>
    );
};

export default PdfViewer;
