
import { createInvoice } from '@/app/lib/actions';
import Ex from '@/app/components/exusestate';

async function fetchCustomers(){
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/customers`
	);
	if (!res.ok) {
		throw new Error('Failed to fetch customers');
	}
	const data = await res.json();

	return data.customers;
}

export default async function Create() {

	const customers = await fetchCustomers();
	return (
		<div>
			<h1>Server Side Rendering</h1>
			<div className='border-2 border-solid border-red-400 p-2'>
				<h2 className='m-0'>Client Component</h2>
				<Ex/>
			</div>
			<ul>
				{customers.map((customer) => (
					<li key={customer.id} value={customer.id}>
						{customer.name}
					</li>
				))}
			</ul>
		</div>
	);
}
