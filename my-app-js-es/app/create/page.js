
import { createInvoice } from '@/app/lib/actions';

async function fetchCustomers() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/customers`, // 취득하려는 resource의 URL을 제공하는 문자열. 문자열변환자를 포함한 객체 일 수 있다.
		{ next: { revalidate: 1 } }
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
			<h1>Create Invoice</h1>
			<form action={createInvoice}>
				<select
					id="customer"
					name="customerId"
					defaultValue=""
					required
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
					type="tel"
					step="0.01"
					placeholder="Enter USD amount"
					required
					/* 	onInput={(e) => {
							if (e.target.value.length > e.target.maxLength)
								e.target.value = e.target.value.slice(0, e.target.maxLength);
						}} */
					maxLength={8}
				/>
				<div className="flex gap-4">
					<div className="flex items-center">
						<input
							id="pending"
							name="status"
							type="radio"
							value="pending"
							required
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
							required
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
