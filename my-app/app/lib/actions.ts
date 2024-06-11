'use server';

import { z } from 'zod';
import pool from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(['pending', 'paid']), //string 값의 고정된 set
	date: z.string(),
});

// zod를 사용하는 이유는 타입스크립트가 런타임에서는 타입에러를 잡을 수 없기 때문입니다. infer

const CreateInvoice = FormSchema.omit({ id: true, date: true }); // zod, 확실한 키를 제거하기 위해 .omit를 사용. 반대는 .pick()

export async function createInvoice(formData: FormData) {

	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	const amountInCents = amount * 100;
	const date = new Date();
	const generateRandomString = (num: number) => {
		const characters = '1234567890abcdefghijklmnopqrstuvwxyz';
		let result = '';
		const charactersLength = characters.length;
		for (let i = 0; i < num; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	const id = `${generateRandomString(8)}-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(12)}`

	try {
		const query = `
		INSERT INTO invoices (id, customer_id, amount, status, date)
		VALUES ($1, $2, $3, $4, $5)
		`;

		const values = [id, customerId, amountInCents, status, date]

		await pool.query(query, values);
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create Invoice.',
		};
	}

	revalidatePath('/');
	redirect('/');


}


export async function updateInvoice(id: string): Promise<void> {

	const query = `
    UPDATE invoices
    SET amount = $1
    WHERE id = $2
  `;
	const values = [Math.round(Math.random() * 10000), id];

	await pool.query(query, values);

	// $1에 values의 첫번째 값, $2에 values의 두 번째 값이 대입

	revalidatePath('/dashboard/invoices');
}

export async function deleteInvoice(customer_id: string): Promise<void> {

	const query = `DELETE FROM invoices WHERE customer_id = $1`;
	const values = [customer_id];
	await pool.query(query, values);

	// $1에 values의 첫번째 값, $2에 values의 두 번째 값이 대입

	revalidatePath('/');
}