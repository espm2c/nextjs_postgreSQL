import { query } from './db';


export async function getUsers() {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}

export async function getPosts(){
  const result = await query('SELECT * FROM posts');
  return result.rows;
};

export async function getInvoices() {
  const  result = await query(`
	SELECT
		invoices.index,
		invoices.amount,
		invoices.id,
		invoices.status,
		to_char(to_date(date, 'Dy Mon DD YYYY'), 'yyyy.mm.dd') AS date,
		customers.name,
		customers.image_url,
		customers.email
	FROM invoices
	JOIN customers ON invoices.customer_id = customers.id
	ORDER BY invoices.index ASC
	`);
  return result.rows;
}

// to_char(to_date(date, 'Dy Mon DD YYYY'), 'yyyy.mm.dd') AS date,
// PostgreSQL은 일반적으로 UTC 시간대를 사용하여 날짜와 시간을 저장하고 처리합니다. 따라서 저장된 데이터를 조회할 때에는 UTC 시간대로 변환되어 반환됩니다.
// 서드를 사용하여 UTC 시간대의 ISO 8601 형식으로 날짜 문자열을 생성합니다.
export async function getCustomers() {
  const  result = await query(`
	SELECT customers.id, customers.name, customers.email, customers.image_url
	FROM customers
	`);
  return result.rows;
}
