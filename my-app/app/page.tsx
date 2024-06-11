import { Metadata } from 'next'
import { User, Invoices, Customers } from './lib/queries';
import { formatDateToLocal } from '@/app/lib/utils';
import {CreateInvoice, UpdateInvoice, DeleteInvoice } from './ui/buttons';
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Next.js',
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`); // '${process.env.NEXT_PUBLIC_BASE_URL}/api/users'에서 리소싱
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await res.json(); // res를 json 형식으로 변경
  return data.users; // 배열로 리턴
}

async function fetchInvoices(): Promise<Invoices[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices`, { next: { revalidate: 1 } });
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
			<CreateInvoice />
      <div>
				<h2>Invoices</h2>
				<table className="table-auto">
					<thead>
						<tr>
							<th>index</th>
							<th>name</th>
							<th>email</th>
							<th>amount</th>
							<th>status</th>
							<th>date</th>
							<th>delete</th>
						</tr>
					</thead>
					<tbody>
						{invoices.map(invoice => (
							<tr key={invoice.index}>
								<td>{invoice.index}</td>
								<td>{invoice.name}</td>
								<td>{invoice.email}</td>
								<td>{invoice.amount.toLocaleString('ko-KR')} <UpdateInvoice id={invoice.id} /></td>
								<td>{invoice.status}</td>
								<td>{formatDateToLocal(invoice.date)}</td>
								<td>
									<DeleteInvoice customer_id={invoice.customer_id}/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
    </div>
  );
}
