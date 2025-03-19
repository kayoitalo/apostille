import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch.service';

const batchService = new BatchService();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id');
    const batches = await batchService.findAll(userId || undefined);
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const notes = formData.get('notes') as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const batch = await batchService.processBatchUpload(userId, name, notes, buffer);

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}