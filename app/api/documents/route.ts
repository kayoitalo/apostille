import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/services/document.service';
import { verifyAuth } from '@/lib/auth';
import { createDocumentSchema } from '@/lib/validations/document';
import { ZodError } from 'zod';

const documentService = new DocumentService();
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await documentService.findAll(userId);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    try {
      const validatedData = createDocumentSchema.parse(body);
      const document = await documentService.create({
        ...validatedData,
        userId,
      });
      
      return NextResponse.json(document, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}