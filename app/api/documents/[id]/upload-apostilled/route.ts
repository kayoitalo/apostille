//home/cc-papa/Downloads/Apostil2/project/app/api/documents/[id]/upload-apostilled/route.ts
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
    const filename = `documents/${params.id}/apostilled_${file.name}`;
    const fileUrl = await cloudStorage.uploadFile(buffer, filename);

    const document = await prisma.document.update({
      where: { id: params.id },
      data: { 
        apostilledFileUrl: fileUrl,
        status: 'COMPLETED'
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading apostilled document:', error);
    return NextResponse.json(
      { error: 'Failed to upload apostilled document' },
      { status: 500 }
    );
  }
}