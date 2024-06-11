import { NextRequest, NextResponse } from 'next/server';
import { getCustomers } from '../../lib/queries';

export async function GET(req: NextRequest) {
	try {
		const customers = await getCustomers();
		return NextResponse.json({ customers });
	} catch (error) {
		console.error('Error fetching customers:', error);
		return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
	}
}