///home/cc-papa/Downloads/Apostil2/project/app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/services/document.service';
import { verifyAuth } from '@/lib/auth';
import { updateDocumentSchema } from '@/lib/validations/document';
import { ZodError } from 'zod';

const documentService = new DocumentService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await documentService.findById(params.id, userId);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    try {
      const validatedData = updateDocumentSchema.parse(body);
      const document = await documentService.update(params.id, userId, validatedData);
      
      return NextResponse.json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await documentService.delete(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}