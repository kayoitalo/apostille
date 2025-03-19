import { cloudStorage } from '@/lib/storage';
import { splitPDF, extractTextFromPDF, analyzePDFContent } from '@/lib/pdf';

const MOCK_BATCHES = [
  {
    id: '1',
    name: 'Certidões Janeiro 2025',
    notes: 'Documentos urgentes para apostilamento',
    status: 'PROCESSING',
    progress: 75,
    userId: '1',
    documents: [
      {
        id: '1',
        title: 'Certidão de Nascimento',
        registrantName: 'Victor Alves',
        status: 'COMPLETED',
        notes: 'Documento processado e apostilado',
        fileUrl: 'https://example.com/doc1.pdf',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        title: 'Certidão de Casamento',
        registrantName: 'Maria Santos',
        status: 'PENDING',
        notes: null,
        fileUrl: 'https://example.com/doc2.pdf',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '3',
        title: 'Certidão de Nascimento',
        registrantName: 'Pedro Oliveira',
        status: 'Pendente',
        notes: 'Em análise para validação',
        fileUrl: 'https://example.com/doc3.pdf',
        createdAt: '2024-01-15T10:00:00Z',
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Documentos Escolares',
    notes: 'Históricos e diplomas para validação internacional',
    status: 'COMPLETED',
    progress: 100,
    userId: '2',
    documents: [
      {
        id: '4',
        title: 'Histórico Escolar',
        registrantName: 'André Victor',
        status: 'COMPLETED',
        notes: 'Apostilamento concluído',
        fileUrl: 'https://example.com/doc4.pdf',
        createdAt: '2025-01-20T14:30:00Z',
      },
      {
        id: '5',
        title: 'Diploma Universitário',
        registrantName: 'Isaque Henrique',
        status: 'COMPLETED',
        notes: 'Apostilamento concluído',
        fileUrl: 'https://example.com/doc5.pdf',
        createdAt: '2025-01-20T14:30:00Z',
      }
    ],
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
  }
];

export class BatchService {
  async create(data: any) {
    // Simulate creating a new batch
    const newBatch = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: 'PENDING',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
    };
    
    return newBatch;
  }

  async findAll(userId?: string) {
    // Simulate fetching batches with optional user filtering
    let batches = [...MOCK_BATCHES];
    
    if (userId) {
      batches = batches.filter(batch => batch.userId === userId);
    }

    return batches;
  }

  async findById(id: string) {
    // Simulate fetching a single batch
    const batch = MOCK_BATCHES.find(b => b.id === id);
    if (!batch) return null;
    return batch;
  }

  async update(id: string, data: any) {
    // Simulate updating a batch
    const batchIndex = MOCK_BATCHES.findIndex(b => b.id === id);
    if (batchIndex === -1) throw new Error('Batch not found');

    const updatedBatch = {
      ...MOCK_BATCHES[batchIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return updatedBatch;
  }

  async delete(id: string) {
    // Simulate deleting a batch
    const batchIndex = MOCK_BATCHES.findIndex(b => b.id === id);
    if (batchIndex === -1) throw new Error('Batch not found');
    return true;
  }

  async processBatchUpload(userId: string, batchName: string, notes: string | null, pdfBuffer: Buffer) {
    // Simulate batch upload processing
    const batch = await this.create({
      name: batchName,
      notes,
      userId,
      status: 'PROCESSING',
    });

    try {
      // Split PDF into individual documents
      const documents = await splitPDF(pdfBuffer);
      let processedCount = 0;

      // Process each document
      for (const [index, docBuffer] of documents.entries()) {
        // Extract text and analyze
        const text = await extractTextFromPDF(docBuffer);
        const analysis = await analyzePDFContent(text);
        
        // Simulate file upload
        const filename = `${batch.id}/${index}.pdf`;
        const fileUrl = await cloudStorage.uploadFile(docBuffer, filename);

        // Create document record
        const document = {
          id: Math.random().toString(36).substr(2, 9),
          title: `Documento ${index + 1}`,
          registrantName: analysis.registrantName,
          notes: null,
          fileUrl,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };

        batch.documents.push(document);
        processedCount++;
        
        // Update batch progress
        batch.progress = Math.round((processedCount / documents.length) * 100);
      }

      // Update final batch status
      batch.status = 'COMPLETED';
      batch.progress = 100;

      return batch;
    } catch (error) {
      // Update batch status on error
      batch.status = 'REJECTED';
      batch.progress = 0;
      throw error;
    }
  }
}