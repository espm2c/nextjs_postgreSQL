import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '../../lib/queries';

export async function GET(req: NextRequest) {
  try {
    const posts = await getPost();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}