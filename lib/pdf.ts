//Já ajustado pelo claude

import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { z } from 'zod';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function splitPDF(pdfBuffer: Buffer): Promise<Buffer[]> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const numberOfPages = pdfDoc.getPageCount();
    const documents: Buffer[] = [];

    for (let i = 0; i < numberOfPages; i++) {
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);
      
      const pdfBytes = await newPdfDoc.save();
      documents.push(Buffer.from(pdfBytes));
    }

    return documents;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error('Failed to split PDF document');
  }
}

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Get all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Define a schema for document analysis results
const documentAnalysisSchema = z.object({
  registrantName: z.string(),
  documentType: z.string(),
  date: z.string().nullable(),
});

export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;

export async function analyzePDFContent(text: string): Promise<DocumentAnalysis> {
  try {
    
    const lines = text.split('\n');
    const nameMatch = lines.find(line => 
      line.toLowerCase().includes('nome') || 
      line.toLowerCase().includes('registrado')
    );
    
    const documentTypeMatch = lines.find(line =>
      line.toLowerCase().includes('certidão') ||
      line.toLowerCase().includes('certificado')
    );
    
    const dateMatch = lines.find(line =>
      line.toLowerCase().includes('data') ||
      line.match(/\d{2}\/\d{2}\/\d{4}/)
    );
    
    const result = {
      registrantName: nameMatch?.split(':')[1]?.trim() || 'Nome não encontrado',
      documentType: documentTypeMatch?.match(/certidão|certificado/i)?.[0] || 'Certidão',
      date: dateMatch?.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || null
    };
    
    // Validate the result
    return documentAnalysisSchema.parse(result);
  } catch (error) {
    console.error('Error analyzing PDF content:', error);
    throw new Error('Failed to analyze PDF content');
  }
}