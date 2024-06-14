import { Metadata } from 'next'
import { User, Invoices, Customers } from './lib/queries';
import { formatDateToLocal } from '@/app/lib/utils';
import { CreateInvoice, UpdateInvoice, DeleteInvoice } from './ui/buttons';
import Link from 'next/link'

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import type { } from '@mui/x-data-grid/themeAugmentation';



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
	function shouldDeleteRow(updatedRow: any) {
		throw new Error('Function not implemented.');
	}

	return (
		<div>
			<h1>DATABASE PostgreSQL</h1>

			<ul>
				<li><Link href="/dashboard">Dashboard</Link></li>
				<li><Link href="/post">post</Link></li>
			</ul>
			<CreateInvoice />
			<DataGrid
				rows={invoices}
				columns={
					[
						{ field: 'id', headerName: 'ID', },
						{ field: 'name', headerName: 'name', },
						{ field: 'email', headerName: 'E-mail', },
						{ field: 'amount', headerName: 'amount', type: 'number', },
						{ field: 'status', headerName: 'status', },
						{ field: 'date', headerName: 'date', },
						{
							field: 'delete',
							headerName: 'delete',

						},
					]
				}

				initialState={{
					sorting: {
						sortModel: [{ field: 'amount', sort: 'asc' }],
					},
					pagination: {
						paginationModel: { page: 0, pageSize: 10 },
					},
				}}
				pageSizeOptions={[3, 5, 10]}
				checkboxSelection


			>

			</DataGrid>
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
