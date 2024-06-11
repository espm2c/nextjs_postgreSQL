import { createInvoice, updateInvoice, deleteInvoice } from '@/app/lib/actions';
import Link from 'next/link';

export function CreateInvoice() {

	// const CreateInvoiceWithId = createInvoice.bind(null, id);
	return (
		<Link
			href="/create"
			className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
		>
			추가
		</Link>


/* 		<form action={CreateInvoiceWithId}>
			<button
				className="rounded-md border p-2 hover:bg-gray-100"
			>
				추가
			</button>
		</form> */

	);
}

export function UpdateInvoice({ id }: { id: string }) {
	const updateInvoiceWithId = updateInvoice.bind(null, id); //

	return (
		<form action={updateInvoiceWithId}>
			<button
				className="rounded-md border p-2 hover:bg-gray-100"
			>
				업데이트
			</button>
		</form>
	);
}

export function DeleteInvoice({ customer_id }: { customer_id: string }) {
	const deleteInvoiceWithId = deleteInvoice.bind(null, customer_id); //

	return (
		<form action={deleteInvoiceWithId}>
			<button
				className="rounded-md border p-2 hover:bg-gray-100"
			>
				업데이트
			</button>
		</form>
	);
}