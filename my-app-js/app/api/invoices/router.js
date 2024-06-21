import { NextRequest, NextResponse } from 'next/server';
import { getInvoices } from '../../lib/queries';

export async function GET(req) {
	try {
		const invoices = await getInvoices();
		return NextResponse.json({ invoices });
	} catch (error) {
		console.error('Error fetching invoices:', error);
		return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
	}
}