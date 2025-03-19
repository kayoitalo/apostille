import { NextRequest, NextResponse } from 'next/server';
import { cloudStorage } from '@/lib/storage';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    const filename = `translations/${params.id}/${file.name}`;
    const fileUrl = await cloudStorage.uploadFile(buffer, filename);

    const assignment = await prisma.translationAssignment.update({
      where: { id: params.id },
      data: {
        translatedFileUrl: fileUrl,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        document: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create notifications
    await prisma.notification.createMany({
      data: [
        {
          type: 'DOCUMENT_COMPLETED',
          title: 'Translation Completed',
          message: `Translation for document "${assignment.document.title}" has been completed`,
          userId: assignment.document.userId, // Client notification
        },
        {
          type: 'DOCUMENT_COMPLETED',
          title: 'Translation Completed',
          message: `Translation for document "${assignment.document.title}" has been completed`,
          userId: 'ADMIN_USER_ID', // Replace with actual admin user ID
        },
      ],
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error uploading translated document:', error);
    return NextResponse.json(
      { error: 'Failed to upload translated document' },
      { status: 500 }
    );
  }
}