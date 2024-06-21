import { NextResponse } from 'next/server';
import { getCustomers } from '../../lib/queries';

export async function GET(request) {
  try {
    const customers = await getCustomers();
		return NextResponse.json({ customers }); // NextResponse사용 시
  } catch (error) {
    console.error('Error fetching invoices:', error);
		return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 }); // NextResponse사용 시
  }
}
