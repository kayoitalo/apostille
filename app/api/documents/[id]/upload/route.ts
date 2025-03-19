import { NextRequest, NextResponse } from 'next/server';
import { cloudStorage } from '@/lib/storage';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `documents/${params.id}/${file.name}`;
    const fileUrl = await cloudStorage.uploadFile(buffer, filename);

    const document = await prisma.document.update({
      where: { id: params.id },
      data: { fileUrl },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
