import pool from './db';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Invoices {
	index: number;
  id: string;
  customer_id: string;
  amount: number;
  status: string;
  date: string;
	name: string;
	email: string;
}

export interface Customers {
  id: string;
	name: string;
	email: string;
  image_url: string;
}
export interface Post {
	index: number;
	tit: string;
	sentence: string;
  date: string;
}

export async function getUsers(): Promise<User[]> {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}

export async function getPost(): Promise<Post[]> {
  const { rows } = await pool.query(`
	SELECT *
	FROM post
	ORDER BY post.index DESC
	`);
  return rows;
}

export async function getInvoices(): Promise<Invoices[]> {
  const { rows } = await pool.query(`
	SELECT invoices.index, invoices.amount, invoices.id, invoices.status, invoices.date, customers.name, customers.image_url, customers.email
	FROM invoices
	JOIN customers ON invoices.customer_id = customers.id
	ORDER BY invoices.index DESC
	`);
  return rows;
}

export async function getCustomers(): Promise<Customers[]> {
  const { rows } = await pool.query(`
	SELECT customers.id, customers.name, customers.email, customers.image_url
	FROM customers
	`);
  return rows;
}
