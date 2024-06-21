import { Pool } from 'pg'

const pool = new Pool({
	// user: process.env.POSTGRES_USER,
	// host: process.env.POSTGRES_HOST,
	// database: process.env.POSTGRES_PASSWORD,
	// password: process.env.POSTGRES_DATABASE,
	// port: 5432,

	connectionString: process.env.POSTGRES_URL,
});

export const query = (text, params) => pool.query(text, params);