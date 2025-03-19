import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch.service';

const batchService = new BatchService();
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = _request.headers.get('user-id');
    if (!params.id) 
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 })
    const batch = await batchService.findOne(params.id, userId || undefined);
    if (batch === undefined) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await request.formData();
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
