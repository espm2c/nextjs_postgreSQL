import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '../../lib/queries';

export async function GET(req: NextRequest) {
  try {
    const users = await getUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}