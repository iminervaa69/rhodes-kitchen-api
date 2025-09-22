import { NextRequest } from 'next/server';
import { toggleCategoryStatus } from '@/lib/services/categoryService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await toggleCategoryStatus(params.id);
    return Response.json(category);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to toggle category status' }, 
      { status: 400 }
    );
  }
}