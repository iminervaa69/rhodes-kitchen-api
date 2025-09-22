import { NextRequest } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/services/categoryService';
import { UpdateCategoryData } from '@/types/category.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await getCategoryById(params.id);
    
    if (!category) {
      return Response.json(
        { error: 'Category not found' }, 
        { status: 404 }
      );
    }
    
    return Response.json(category);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to fetch category' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateCategoryData = await request.json();
    const category = await updateCategory(params.id, data);
    return Response.json(category);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to update category' }, 
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteCategory(params.id);
    return Response.json(result);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to delete category' }, 
      { status: 400 }
    );
  }
}
