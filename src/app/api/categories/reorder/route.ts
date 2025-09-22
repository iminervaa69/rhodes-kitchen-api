import { NextRequest } from 'next/server';
import { reorderCategories } from '@/lib/services/categoryService';

export async function POST(request: NextRequest) {
  try {
    const data: Array<{ id: string; display_order: number }> = await request.json();
    
    if (!Array.isArray(data)) {
      return Response.json(
        { error: 'Invalid data format. Expected array of {id, display_order}' }, 
        { status: 400 }
      );
    }
    
    const result = await reorderCategories(data);
    return Response.json(result);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to reorder categories' }, 
      { status: 500 }
    );
  }
}
