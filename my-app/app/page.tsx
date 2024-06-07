import { Metadata } from 'next'
import { User, Invoices } from './lib/queries';
import { formatDateToLocal } from '@/app/lib/utils';
import {UpdateInvoiceEX } from './ui/buttons';
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Next.js',
}


async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await res.json();
  return data.users;
}

async function fetchInvoices(): Promise<Invoices[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices`);
  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }
  const data = await res.json();
  return data.invoices;
}

export default async function Home() {
  const users = await fetchUsers();
  const invoices = await fetchInvoices();

  return (
    <div>
      <h1>DATABASE PostgreSQL</h1>
			<Link href="/dashboard">Dashboard</Link>
      <div>
				<h2>Users</h2>
				<ul>
					{users.map(user => (
						<li key={user.id}>{user.name}</li>
					))}
				</ul>
				<h2>Invoices</h2>
				<table  className="table-auto">
					<thead>
						<tr>
							<th>name</th>
							<th>email</th>
							<th>amount</th>
							<th>status</th>
							<th>date</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{invoices.map(invoice => (
							<tr key={invoice.id}>
								<td>{invoice.name}</td>
								<td>{invoice.email}</td>
								<td>{invoice.amount} <UpdateInvoiceEX id={invoice.id} /></td>
								<td>{invoice.status}</td>
								<td>{formatDateToLocal(invoice.date)}</td>
								<td>
									<button className="rounded-md border p-2 hover:bg-gray-100">button</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
    </div>
  );
}
