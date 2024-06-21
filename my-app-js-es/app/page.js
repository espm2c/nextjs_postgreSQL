'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { formatDateToLocal } from '@/app/lib/utils';
import { CreateInvoice } from '@/app/ui/buttons';

import EnhancedTableHead from '@/app/components/enhancedTableHead'
import EnhancedTableToolbar from '@/app/components/enhancedTableToolbar'
import Test from './components/testServer';


import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';


/* nextjs */
import { useSearchParams } from 'next/navigation'
import { Create } from '@/app/create/page'

/* 열을 몇개 보여줄 것인지 결정을 해줍니다. */
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) { // 초기 order는 'desc', 초기 orderBy는 'index'
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy) // 초기 order가 내림차순이면 descendingComparator()를 그대로 사용
		: (a, b) => -descendingComparator(a, b, orderBy);// 초기 order가 오름차순이면 descendingComparator()에 '-'를 곱하여 사용
}

function stableSort(array, comparator) { // sort 명령 시, 데이터를 정렬하기 위한 함수
	return array.slice().sort(comparator);
}

export default function Page() {
	const searchParams = useSearchParams();
	const pageQuery = searchParams.get('page');
	const limitQuery = searchParams.get('limit');

	const [invoices, setInvoices] = React.useState([]);
	const [selected, setSelected] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [order, setOrder] = React.useState('desc');
	const [orderBy, setOrderBy] = React.useState('index');

	const [page, setPage] = React.useState(parseInt(pageQuery || '0', 10)); // pageQuery 값이 초기에 없을 경우 0으로 설정하여 page에 이항
	const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limitQuery || '5', 10));


	/* pagination 변경시  */
	React.useEffect(() => {
		setRowsPerPage(parseInt(limitQuery || '5', 10));
		setPage(invoices.length > rowsPerPage * pageQuery ? parseInt(pageQuery || '0', 10) : 0);
		pageQuery * rowsPerPage > invoices.length && updatePaging(page);
	}, [limitQuery, pageQuery, page]);
	/* // pagination 변경시  */
	/* invoices 데이터 불러오기 */
	React.useEffect(() => {
		async function fetchInvoices() {
			try {
				const response = await fetch('/api/invoices');
				const data = await response.json();
				setInvoices(data);
			} catch (error) {
				console.error('Error fetching invoices:', error);
			} finally {
				setLoading(false);
			}
		}
		fetchInvoices();
	}, []);
	/* // invoices 데이터 불러오기 */

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = invoices.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	/* row 클릭 시 */

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected);
	};

	/* // row 클릭 시 */

	/* paging 관련 */
	function updatePaging(pageOrder) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('page', pageOrder)
		window.history.pushState(null, '', `?${params.toString()}`)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		updatePaging(newPage);
	};
	/* // paging 관련 */

	/* Rows per page 관련 */

	function updateRowsPerPage(pageOrder) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('limit', pageOrder)
		window.history.pushState(null, '', `?${params.toString()}`)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		updateRowsPerPage(parseInt(event.target.value, 10))
	};

	/* // Rows per page 관련 */

	function EnhancedTableToolbar(props) {
		const { numSelected, handleDelete } = props;

		return (
			<Toolbar
				sx={{
					pl: { sm: 2 },
					pr: { xs: 1, sm: 1 },
					...(numSelected > 0 && {
						bgcolor: (theme) =>
							alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
					}),
				}}
			>
				{numSelected > 0 ? (
					<Typography
						sx={{ flex: '1 1 100%' }}
						color="inherit"
						variant="subtitle1"
						component="div"
					>
						{numSelected} selected
					</Typography>
				) : (
					<Typography
						sx={{ flex: '1 1 100%' }}
						variant="h6"
						id="tableTitle"
						component="div"
					>
						Invoices
					</Typography>
				)}

				{numSelected > 0 && (
					<Tooltip title="Delete">
						<IconButton onClick={() => handleDelete(selected, setInvoices, setSelected)}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				)}
			</Toolbar>
		);
	}

	EnhancedTableToolbar.propTypes = {
		numSelected: PropTypes.number.isRequired,
		handleDelete: PropTypes.func.isRequired,
	};

	/* 삭제 관련 */
/* 	async function handleDelete() {
		if (window.confirm(`${selected.length}개의 파일을 삭제합니까?`)) {
			const deleteRequests = selected.map(async (id) => {
				try {
					const response = await fetch(`/api/invoices/${id}`, {
						method: 'DELETE',
					});
					if (!response.ok) {
						throw new Error('Failed to delete invoice from handleDelete');
					}
				} catch (error) {
					console.error('Error deleting invoice from handleDelete:', error);
				}
			});

			Promise.all(deleteRequests)
				.then(() => {
					setInvoices((prevInvoices) =>
						prevInvoices.filter((invoice) => !selected.includes(invoice.id)), // invoice는 배열. invoice배열에서 선택된 배열(selected)중 invoice.id값이 같지 않은 것으로 setInvoices 합니다.
					);
					setSelected([]); // 그리고 selected를 비웁니다.
				})
				.catch((error) => {
					console.error('Error deleting invoices:', error);
				});
			alert("삭제가 완료되었습니다.")
		} else {
			alert("삭제가 취소되었습니다.")
		}
	}; */

	async function handleDelete(selected, setInvoices, setSelected) {
		if (window.confirm(`${selected.length}개의 파일을 삭제합니까?`)) {
			try {
				const response = await fetch('/api/invoices/delete', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ ids: selected }),
				});

				if (!response.ok) {
					throw new Error('Failed to delete invoices');
				}

				setInvoices((prevInvoices) =>
					prevInvoices.filter((invoice) => !selected.includes(invoice.id))
				);
				setSelected([]);
				alert('삭제가 완료되었습니다.');
			} catch (error) {
				console.error('Error deleting invoices:', error);
				alert('삭제 중 오류가 발생했습니다.');
			}
		} else {
			alert('삭제가 취소되었습니다.');
		}
	}

	/* // 삭제 관련 */

	const isSelected = (id) => selected.indexOf(id) !== -1;

	const visibleRows = React.useMemo(
		() =>
			stableSort(invoices, getComparator(order, orderBy)).slice( // invoices는 배열
				page * rowsPerPage, // 초기 0 * 5
				page * rowsPerPage + rowsPerPage, // 초기 0 * 5 + 5
			),
		[invoices, order, orderBy, page, rowsPerPage],
	);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Invoices</h1>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<EnhancedTableToolbar numSelected={selected.length} handleDelete={handleDelete} />
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
						>
							<EnhancedTableHead
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={invoices.length}
							/>
							<TableBody>
								{visibleRows.map((invoice, index) => {
									const isItemSelected = isSelected(invoice.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											onClick={(event) => {
												handleClick(event, invoice.id)
											}}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={invoice.id}
											hover
											selected={isItemSelected}
											sx={{ cursor: 'pointer' }}
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													checked={isItemSelected}
													inputProps={{
														'aria-labelledby': labelId,
													}}
												/>
											</TableCell>
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												{invoice.index}
											</TableCell>
											<TableCell>{invoice.name}</TableCell>
											<TableCell>{invoice.email}</TableCell>
											<TableCell>{invoice.amount}</TableCell>
											<TableCell>{invoice.status}</TableCell>
											<TableCell>{formatDateToLocal(invoice.date)}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						count={invoices.length}
						onPageChange={handleChangePage}
						page={page}
						rowsPerPage={rowsPerPage}
						component="div"
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[5, 10, 25]}
					/>
				</Paper>
				<CreateInvoice />
			</Box>
		</div>
	);
}
