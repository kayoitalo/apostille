// app/api/batches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch.service';

const batchService = new BatchService();

// Este arquivo não deve ter um params.id porque é a rota /api/batches
// Remova o segundo parâmetro context completamente
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    // Obter todos os batches em vez de procurar por ID
    const batches = await batchService.findAll(userId || undefined);
    return NextResponse.json(batches);
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