
import { createInvoice } from '@/app/lib/actions';

async function fetchCustomers(){
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/customers`,
		{ next: { revalidate: 1 } } // nextjs에서의 Time-based Revalidation. 재검증을 1초 간격으로 진행
		// revalidation은 데이터 캐시를 퍼징(완전 삭제) 및 최근 데이터를 리패칭(다시 가져와서 사용)의 진행입니다.
	);
	if (!res.ok) {
		throw new Error('Failed to fetch customers');
	}
	const data = await res.json();

	return data.customers;
}

export default async function CreateInvoices() {

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
