import { z } from 'zod';
import { DocumentStatus, DocumentType } from '@prisma/client';

export const createDocumentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  registrantName: z.string().min(2, 'Registrant name must be at least 2 characters'),
  documentType: z.nativeEnum(DocumentType),
  notes: z.string().optional(),
  fileUrl: z.string().url('Invalid file URL'),
  serviceId: z.string().uuid('Invalid service ID'),
  batchId: z.string().uuid('Invalid batch ID').optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  registrantName: z.string().min(2, 'Registrant name must be at least 2 characters').optional(),
  documentType: z.nativeEnum(DocumentType).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  fileUrl: z.string().url('Invalid file URL').optional(),
  apostilledFileUrl: z.string().url('Invalid apostilled file URL').optional(),
  batchId: z.string().uuid('Invalid batch ID').optional().nullable(),
});
