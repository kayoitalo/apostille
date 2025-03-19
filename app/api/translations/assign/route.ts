import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, translatorId } = await req.json();

    if (!documentId || !translatorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const assignment = await prisma.TranslationAssignment.create({
      data: {
        documentId,
        translatorId,
        status: 'PENDING',
      },
      include: {
        document: true,
        translator: true,
      },
    });

    // Create notification for translator
    await prisma.notification.create({
      data: {
        type: 'DOCUMENT_UPLOADED',
        title: 'New Translation Assignment',
        message: `You have been assigned a new document for translation: "${assignment.document.title}"`,
        userId: translatorId,
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Failed to assign translator:', error);
    return NextResponse.json(
      { error: 'Failed to assign translator' },
      { status: 500 }
    );
  }
}