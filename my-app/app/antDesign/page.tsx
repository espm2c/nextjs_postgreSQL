import { Metadata } from 'next'
import { Invoices } from '../lib/queries';
import { formatDateToLocal } from '@/app/lib/utils';
import { CreateInvoice, UpdateInvoice, DeleteInvoice } from '../ui/buttons';
import Link from 'next/link'


import { Divider, Radio, Table } from 'antd';
import type { TableColumnsType } from 'antd';


async function fetchInvoices(): Promise<Invoices[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices`, { next: { revalidate: 1 } });
	if (!res.ok) {
		throw new Error('Failed to fetch invoices');
	}
	const data = await res.json();

	return data.invoices;
}


export const metadata: Metadata = {
	title: 'Next.js',
}



export default async function Home() {
	const invoices = await fetchInvoices();
	const columns = [
		{
			title: 'index',
			dataIndex: 'index',
			key: 'index',
		},
		{
			title: 'id',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'amount',
			dataIndex: 'amount',
			key: 'amount',
		},
		{
			title: 'status',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'date',
			dataIndex: 'date',
			key: 'date',
		},
	];

	return (
		<div>
			<h1>DATABASE PostgreSQL</h1>
			<Table dataSource={invoices} columns={columns} />;
			<ul>
				<li><Link href="/dashboard">Dashboard</Link></li>
				<li><Link href="/post">post</Link></li>
			</ul>

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
									<DeleteInvoice id={invoice.id} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
