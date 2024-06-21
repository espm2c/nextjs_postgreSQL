import { NextResponse } from 'next/server';
import { deleteInvoice } from '@/app/lib/actions';

export async function POST(request) {
	try {
		const { ids } = await request.json();
		await deleteInvoice(ids); // 각 id를 삭제하는 함수 호출

		return NextResponse.json({ message: 'Invoices deleted successfully' });
	} catch (error) {
		console.error('Error deleting invoices:', error);
		return NextResponse.json({ error: 'Failed to delete invoices' }, { status: 500 });
	}
}
