import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // Core PDF.js library
import * as pdfjsViewer from "pdfjs-dist/legacy/web/pdf_viewer"; // PDF.js viewer
import "pdfjs-dist/legacy/web/pdf_viewer.css"; // PDF.js viewer styles

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PdfViewer = ({ fileUrl }) => {
    const viewerContainerRef = useRef(null);
    const hasLoadedRef = useRef(false); // Ref to track if loadPdf has been called

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
            if (hasLoadedRef.current) {
                console.log("loadPdf has already been called, skipping...");
                return;
            }
            hasLoadedRef.current = true; // Mark as called

            try {
                const loadingTask = pdfjsLib.getDocument(fileUrl);
                const pdf = await loadingTask.promise;

                console.log(`Original PDF Page Count: ${pdf.numPages}`);
                console.log("PDF Info:", pdf._pdfInfo);

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    console.log(`Rendering page ${i}...`);
                }

                pdfViewer.setDocument(pdf);
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        };

        loadPdf();
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
