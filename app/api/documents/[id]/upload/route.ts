//home/cc-papa/Downloads/Apostil2/project/app/api/documents/[id]/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cloudStorage } from '@/lib/storage';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
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