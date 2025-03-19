import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { notes } = await request.json();
    
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