import { NextRequest } from 'next/server';
import { restoreCategory } from '@/lib/services/categoryService'
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await restoreCategory(params.id);
    return Response.json(category);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to restore category' }, 
      { status: 400 }
    );
  }
}