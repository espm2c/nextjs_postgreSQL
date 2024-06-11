import { Metadata } from 'next'
import { Customers } from '../lib/queries';
import Link from 'next/link';
import { createInvoice } from '../lib/actions';

export const metadata: Metadata = {
	title: 'Next.js',
}


async function fetchCustomers(): Promise<Customers[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/customers`, { next: { revalidate: 1 } });
	if (!res.ok) {
		throw new Error('Failed to fetch customers');
	}
	const data = await res.json();

	return data.customers;
}

export default async function Page() {

	const customers = await fetchCustomers();
	return (
		<div>
			<h1>Create Invoice</h1>
			<form action={createInvoice}>
				<select
					id="customer"
					name="customerId"
					defaultValue=""
				>
					<option value="" disabled>
						Select a customer
					</option>
					{customers.map((customer) => (
						<option key={customer.id} value={customer.id}>
							{customer.name}
						</option>
					))}
				</select>
				<input
					id="amount"
					name="amount"
					type="number"
					step="0.01"
					placeholder="Enter USD amount"
				/>
				<div className="flex gap-4">
					<div className="flex items-center">
						<input
							id="pending"
							name="status"
							type="radio"
							value="pending"
						/>
						<label
							htmlFor="pending"
						>
							Pending
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="paid"
							name="status"
							type="radio"
							value="paid"
						/>
						<label
							htmlFor="paid"
						>
							Paid
						</label>
					</div>
				</div>


				<button>추가</button>

			</form>
		</div>
	);
}
