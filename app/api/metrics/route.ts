import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Save a custom metric
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { name, formula, datasetId, value } = await req.json();

    if (!name || !datasetId) {
      return NextResponse.json({ success: false, error: 'Name and datasetId are required' }, { status: 400 });
    }

    // Verify ownership through project chain
    const dataset = await prisma.dataset.findFirst({
      where: { id: datasetId },
      include: { project: { select: { userId: true } } },
    });

    if (!dataset || dataset.project.userId !== user.userId) {
      return NextResponse.json({ success: false, error: 'Dataset not found' }, { status: 404 });
    }

    const metric = await prisma.metric.create({
      data: {
        name,
        formula: formula || null,
        datasetId,
        value: value ?? null,
      },
    });

    return NextResponse.json({ success: true, data: metric });
  } catch (error) {
    console.error('Metrics POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get metrics for a dataset
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const datasetId = searchParams.get('datasetId');

    if (!datasetId) {
      return NextResponse.json({ success: false, error: 'datasetId is required' }, { status: 400 });
    }

    const metrics = await prisma.metric.findMany({
      where: { datasetId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Metrics GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
