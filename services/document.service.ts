// Simulated data
const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Certidão de Nascimento',
    registrantName: 'Kayo ITalo',
    status: 'COMPLETED',
    notes: 'Documento validado e apostilado',
    fileUrl: 'https://example.com/doc1.pdf',
    apostilledFileUrl: 'https://example.com/doc1-apostilled.pdf',
    userId: '1',
    batchId: '1',
    batch: {
      id: '1',
      name: 'Certidões Janeiro 2025',
      status: 'PROCESSING',
      progress: 75,
    },
    user: {
      name: 'Empresa Master',
      company: 'Empresa Master LTDA',
    },
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Certidão de Casamento',
    registrantName: 'Laís M. dos Santos Fídelis',
    status: 'PENDING',
    notes: null,
    fileUrl: 'https://example.com/doc2.pdf',
    apostilledFileUrl: null,
    userId: '1',
    batchId: '1',
    batch: {
      id: '1',
      name: 'Certidões Janeiro 2025',
      status: 'PROCESSING',
      progress: 75,
    },
    user: {
      name: 'Empresa Simplice',
      company: 'Empresa A LTDA',
    },
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '3',
    title: 'Histórico Escolar',
    registrantName: 'Isaque Henrique',
    status: 'COMPLETED',
    notes: 'Apostilamento concluído',
    fileUrl: 'https://example.com/doc3.pdf',
    apostilledFileUrl: 'https://example.com/doc3-apostilled.pdf',
    userId: '2',
    batchId: '2',
    batch: {
      id: '2',
      name: 'Documentos Escolares',
      status: 'COMPLETED',
      progress: 100,
    },
    user: {
      name: 'Empresa Master',
      company: 'Empresa Master LTDA',
    },
    createdAt: '2025-01-20T14:30:00Z',
  },
  {
    id: '4',
    title: 'Diploma Universitário',
    registrantName: 'Myllena Areda',
    status: 'REVIEWING',
    notes: 'Em análise',
    fileUrl: 'https://example.com/doc4.pdf',
    apostilledFileUrl: null,
    userId: '2',
    batchId: '2',
    batch: {
      id: '2',
      name: 'Documentos Escolares',
      status: 'COMPLETED',
      progress: 100,
    },
    user: {
      name: 'Empresa Master',
      company: 'Empresa Master LTDA',
    },
    createdAt: '2025-01-20T14:30:00Z',
  },
];

export class DocumentService {
  async create(data: any) {
    const newDocument = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      user: {
        name: 'Empresa Master',
        company: 'Empresa Master LTDA',
      },
    };
    
    return newDocument;
  }

  async findAll(userId?: string) {
    let documents = [...MOCK_DOCUMENTS];
    
    if (userId) {
      documents = documents.filter(doc => doc.userId === userId);
    }

    return documents;
  }

  async findById(id: string, userId?: string) {
    let document = MOCK_DOCUMENTS.find(d => d.id === id);
    if (!document) return null;
    
    if (userId && document.userId !== userId) {
      return null;
    }

    return document;
  }

  async update(id: string, userId: string, data: any) {
    const documentIndex = MOCK_DOCUMENTS.findIndex(d => d.id === id && d.userId === userId);
    if (documentIndex === -1) throw new Error('Document not found');

    const updatedDocument = {
      ...MOCK_DOCUMENTS[documentIndex],
      ...data,
    };

    return updatedDocument;
  }

  async delete(id: string, userId: string) {
    const documentIndex = MOCK_DOCUMENTS.findIndex(d => d.id === id && d.userId === userId);
    if (documentIndex === -1) throw new Error('Document not found');
    return true;
  }
}