"use client";

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        renderPage(pdf, 1);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [url]);

  const renderPage = async (pdf: PDFDocumentProxy, pageNumber: number) => {
    if (!canvasRef.current) return;

    const page = await pdf.getPage(pageNumber);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  const changePage = async (delta: number) => {
    if (!pdfDoc) return;

    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= pdfDoc.numPages) {
      setCurrentPage(newPage);
      await renderPage(pdfDoc, newPage);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="border rounded-lg shadow-lg" />
      {pdfDoc && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {pdfDoc.numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={currentPage >= pdfDoc.numPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}