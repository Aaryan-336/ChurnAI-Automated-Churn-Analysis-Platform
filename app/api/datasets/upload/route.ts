import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeSchema } from '@/lib/schema-analyzer';
import Papa from 'papaparse';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: user.userId },
    });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const text = await file.text();
    let rows: Record<string, string>[] = [];

    if (file.name.endsWith('.csv')) {
      const result = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
      });
      rows = result.data;
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Dynamic import to keep bundle smaller
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(text, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      rows = XLSX.utils.sheet_to_json<Record<string, string>>(workbook.Sheets[sheetName], { defval: '' });
    } else {
      return NextResponse.json({ success: false, error: 'Only CSV and XLSX files are supported' }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'File contains no data' }, { status: 400 });
    }

    // Analyze the schema
    const schema = analyzeSchema(rows);

    // Save dataset to database
    const dataset = await prisma.dataset.create({
      data: {
        name: file.name,
        projectId,
        rowCount: rows.length,
        schema: JSON.stringify(schema),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        dataset,
        schema,
        preview: rows.slice(0, 10),
        totalRows: rows.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process file' }, { status: 500 });
  }
}
