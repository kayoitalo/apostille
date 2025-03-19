//feita pelo claude, revisar de onde ele tirou pra excluir os dois arquivos dessa pasta

import { z } from 'zod';
import { BatchStatus, Priority } from '@prisma/client';

export const createBatchSchema = z.object({
  name: z.string().min(3, 'Batch name must be at least 3 characters'),
  notes: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
});

export const updateBatchSchema = z.object({
  name: z.string().min(3, 'Batch name must be at least 3 characters').optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(BatchStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  progress: z.number().min(0).max(100).optional(),
});