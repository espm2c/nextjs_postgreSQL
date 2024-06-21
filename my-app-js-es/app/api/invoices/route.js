
import { getInvoices } from '../../lib/queries';

export async function GET(request) {
	console.log('GET /api/invoices called');
	console.log('Request headers:', request.headers);
  try {
    const invoices = await getInvoices();
    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function OPTIONS(request) {
  console.log('OPTIONS /api/invoices called');
  console.log('Request headers:', request.headers);
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'OPTIONS, GET',
      'Content-Type': 'application/json',
    },
  });
}
