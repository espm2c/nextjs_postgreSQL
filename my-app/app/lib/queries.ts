import pool from './db';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Invoices {
  id: string;
  customer_id: string;
  amount: number;
  status: string;
  date: string;
	name: string;
	email: string;
}

export async function getUsers(): Promise<User[]> {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}

export async function getInvoices(): Promise<Invoices[]> {
  const { rows } = await pool.query(`
	SELECT invoices.amount, invoices.id, invoices.status, invoices.date, customers.name, customers.image_url, customers.email
	FROM invoices
	JOIN customers ON invoices.customer_id = customers.id
	ORDER BY invoices.date DESC
	`);
  return rows;
}
