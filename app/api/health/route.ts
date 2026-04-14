import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.query('SELECT 1');
    return NextResponse.json({
      success: true,
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, status: 'error', db: 'disconnected' },
      { status: 503 }
    );
  }
}