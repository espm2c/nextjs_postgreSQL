import { updateInvoiceEX } from '@/app/lib/actions';

export function UpdateInvoiceEX({ id }: { id: string }) {

	const updateInvoiceEXWithId = updateInvoiceEX.bind(null, id);
	return (
		<form action={updateInvoiceEXWithId}>
			<button
				className="rounded-md border p-2 hover:bg-gray-100"
			>
				업데이트 {id}
			</button>
		</form>
	);
}