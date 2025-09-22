import { NextRequest } from 'next/server';
import { getCategoriesStats } from '@/lib/services/categoryService';

export async function GET(request: NextRequest) {
  try {
    const stats = await getCategoriesStats();
    return Response.json(stats);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to fetch category statistics' }, 
      { status: 500 }
    );
  }
}