///home/cc-papa/Downloads/Apostil2/project/app/api/documents/[id]/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { notes } = await req.json();
    
    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        notes,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error completing document:', error);
    return NextResponse.json(
      { error: 'Failed to complete document' },
      { status: 500 }
    );
  }
}