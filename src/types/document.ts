import { DocumentStatus } from "@prisma/client";

export interface Document {
  id: string;
  title: string;
  type: string;
  status: DocumentStatus
  fileUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentCreate {
  registrantName: string;
  serviceId: string;
  title: string;
  type: string;
  fileUrl: string;
  userId: string;
}

export interface DocumentUpdate {
  title?: string;
  type?: string;
  fileUrl?: string;
  content?: string;
  status?: DocumentStatus;
}