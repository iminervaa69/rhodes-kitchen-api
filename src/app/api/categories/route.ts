import { NextRequest } from 'next/server';
import { getCategories, createCategory } from '@/lib/services/categoryService';
import { CreateCategoryData, CategoryFilters, PaginationOptions } from '@/types/category.types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: CategoryFilters = {};
    if (searchParams.get('is_active')) {
      filters.is_active = searchParams.get('is_active') === 'true';
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }
    
    const pagination: PaginationOptions = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'display_order',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
    };
    
    const result = await getCategories(filters, pagination);
    return Response.json(result);
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateCategoryData = await request.json();
    
    if (!data.category_id || !data.name) {
      return Response.json(
        { error: 'category_id and name are required' }, 
        { status: 400 }
      );
    }
    
    const category = await createCategory(data);
    return Response.json(category, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to create category' }, 
      { status: 400 }
    );
  }
}
