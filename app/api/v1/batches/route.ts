import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch.service';
import { verifyAuth } from '@/lib/auth';

const batchService = new BatchService();

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const batches = await batchService.findAll(userId);
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const notes = formData.get('notes') as string;

    if (!file || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const batch = await batchService.processBatchUpload(userId, name, notes, buffer);

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 });
  }
}