import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/services/document.service';

const documentService = new DocumentService();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await documentService.findAll(userId);
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const document = await documentService.create({ ...data, userId });
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}