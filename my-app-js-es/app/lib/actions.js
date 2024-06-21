'use server';
import {pool} from './db';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoice(formData) {

	const generateRandomString = (num) => {
		const characters = '1234567890abcdefghijklmnopqrstuvwxyz';
		let result = '';
		const charactersLength = characters.length;
		for (let i = 0; i < num; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	const { customerId, amount, status }= ({
		customerId: formData.get('customerId'), // customerId key에 해당 폼의 name="customerId"이 유효하면 정보를 반환합니다.
		amount: formData.get('amount'),
		status: formData.get('status'),
	}); // 데이터가 유효한지 검증. 유효하면 풀타입 정보를 반환! 아니면 오류를 보냄.

	const amountInCents = amount * 100;
	const date = new Date();

	try {
		const query = `
		INSERT INTO invoices (id, customer_id, amount, status, date)
		VALUES ($1, $2, $3, $4, $5)
		`;
		const id = `${generateRandomString(8)}-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(12)}`;
		const values = [id, customerId, amountInCents, status, date];

		await pool.query(query, values);
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create Invoice.',
		};
	}

	revalidatePath('/');
	redirect('/');
}

export async function updateInvoice(id) {

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

export async function deleteInvoice(ids) {
	const query = `DELETE FROM invoices WHERE id = ANY($1)`;
	const values = [ids];
	try {
		//const client = await pool.connect()
    await pool.query(query, values);
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }

	// $1에 values의 첫번째 값, $2에 values의 두 번째 값이 대입

	 revalidatePath('/');
}
