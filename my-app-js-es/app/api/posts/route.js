// app/api/posts/route.js
// import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '../../lib/queries';

export async function GET(request) {
  try {
    const posts = await getPosts();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
		// return NextResponse.json({ posts }); // NextResponse사용 시
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
		// return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 }); // NextResponse사용 시
  }
}
