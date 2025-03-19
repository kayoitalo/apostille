import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

export async function splitPDF(pdfBuffer: Buffer): Promise<Buffer[]> {
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
}

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
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
}

export async function analyzePDFContent(text: string): Promise<{
  registrantName: string;
  documentType: string;
  date: string | null;
}> {
  // This is a placeholder for GPT integration
  // In a real implementation, you would send this text to GPT API
  // and get structured information back
  
  const lines = text.split('\n');
  const nameMatch = lines.find(line => 
    line.toLowerCase().includes('nome') || 
    line.toLowerCase().includes('registrado')
  );
  
  return {
    registrantName: nameMatch?.split(':')[1]?.trim() || 'Nome não encontrado',
    documentType: 'Certidão',
    date: null
  };
}