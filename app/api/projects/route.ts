import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all projects for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.userId },
      include: {
        datasets: { select: { id: true, name: true, rowCount: true, createdAt: true } },
        dashboards: { select: { id: true, name: true, createdAt: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new project
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Project name is required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description || null,
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
