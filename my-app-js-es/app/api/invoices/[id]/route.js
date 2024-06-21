// app/api/invoices/[id]/route.js
import { NextResponse } from 'next/server';
import { deleteInvoice } from '@/app/lib/actions';

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await deleteInvoice(id);
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
		console.error('Error deleting invoice:', error);
    return NextResponse.json({ message: 'Error deleting invoice', error: error.message }, { status: 500 });
  }
}
