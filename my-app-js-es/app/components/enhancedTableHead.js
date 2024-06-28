'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';

const headCells = [ // table thead에 들어갈 배열
	{ id: 'index', label: 'Index', },
	{ id: 'name', label: 'Name', },
	{ id: 'email', label: 'E-mail', },
	{ id: 'amount', label: 'Amount', },
	{ id: 'status', label: 'Status', },
	{ id: 'date', label: 'Date', },
];

export default function EnhancedTableHead(props) { // EnhancedTableHead 컴포넌트
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, visibleRows } = props; // 각 상수에 props를 이항

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox // table thead에 들어가는 checkbox 입니다.
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={numSelected === visibleRows}
						//checked={rowCount > 0 && numSelected === rowCount}
						//checked={false}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}