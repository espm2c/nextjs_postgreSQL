import {query } from './db';


export async function getUsers() {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}


export const getPosts = async () => {
  const result = await query('SELECT * FROM posts');
  return result.rows;
};

export async function getInvoices() {
  const { rows } = await pool.query(`
	SELECT invoices.index, invoices.amount, invoices.id, invoices.status, invoices.date, customers.name, customers.image_url, customers.email
	FROM invoices
	JOIN customers ON invoices.customer_id = customers.id
	ORDER BY invoices.index DESC
	`);
  return rows;
}

export async function getCustomers() {
  const { rows } = await pool.query(`
	SELECT customers.id, customers.name, customers.email, customers.image_url
	FROM customers
	`);
  return rows;
}
