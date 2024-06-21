import { query } from './db';


export async function getUsers() {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}

export async function getPosts(){
  const result = await query('SELECT * FROM posts');
  return result.rows;
};

/* export async function getInvoices(){
  const result = await query('SELECT * FROM posts');
  return result.rows;
}; */

export async function getInvoices() {
  const  result = await query(`
	SELECT invoices.index, invoices.amount, invoices.id, invoices.status, invoices.date, customers.name, customers.image_url, customers.email
	FROM invoices
	JOIN customers ON invoices.customer_id = customers.id
	ORDER BY invoices.index ASC
	`);
  return result.rows;
}

export async function getCustomers() {
  const  result = await query(`
	SELECT customers.id, customers.name, customers.email, customers.image_url
	FROM customers
	`);
  return result.rows;
}
