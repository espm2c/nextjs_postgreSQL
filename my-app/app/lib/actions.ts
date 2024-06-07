'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



/* export interface Invoice {
	amount: number;
} */

export async function updateInvoiceEX(id: string): Promise<void> {
  const query = `
    UPDATE invoices
    SET amount = $1
    WHERE id = $2
  `;
  const values = [Math.round(Math.random() * 10000), id];

  await pool.query(query, values);

  revalidatePath('/dashboard/invoices');

/* 	await pool.query(`
	UPDATE invoices
	SET amount = ${Math.round(Math.random() * 10000)}
	WHERE id = ${id}
`);

	revalidatePath('/dashboard/invoices'); */
}