import { Document } from './document';

export interface Batch {
  id: string;
  name: string;
  userId: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED';
}