import { createInvoice, updateInvoice, deleteInvoice } from '@/app/lib/actions';
import Link from 'next/link';

export function CreateInvoice() {
	return (
		<Link
			href="/create"
			className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
		>
			추가
		</Link>
	);
}

export function UpdateInvoice(id) {
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

export function DeleteInvoice({ id } ) {
	const deleteInvoiceWithId = deleteInvoice.bind(null, id); //

	return (
		<form action={deleteInvoiceWithId}>
			<button
				className="rounded-md border p-2 hover:bg-gray-100"
			>
				삭제
			</button>
		</form>
	);
}