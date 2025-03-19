import { NextRequest, NextResponse } from 'next/server';
import { BatchService } from '@/services/batch.service';

const batchService = new BatchService();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const batch = await batchService.findById(params.id);
    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const batch = await batchService.update(params.id, data);
    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await batchService.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}