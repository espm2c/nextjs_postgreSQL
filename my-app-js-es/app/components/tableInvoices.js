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


import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';


/* nextjs */
import { useSearchParams } from 'next/navigation';

const headCells = [ // table thead에 들어갈 배열
	{ id: 'index', label: 'Index', },
	{ id: 'name', label: 'Name', },
	{ id: 'email', label: 'E-mail', },
	{ id: 'amount', label: 'Amount', },
	{ id: 'status', label: 'Status', },
	{ id: 'date', label: 'Date', },
];

function EnhancedTableHead(props) { // EnhancedTableHead 컴포넌트
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


/* 열을 몇개 보여줄 것인지 결정을 해줍니다. */
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) { //
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) { // 초기 order는 'desc', 초기 orderBy는 'index'
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy) // 초기 order가 내림차순(desc)이면 descendingComparator()를 그대로 사용
		: (a, b) => -descendingComparator(a, b, orderBy);// 초기 order가 오름차순(asc)이면 descendingComparator()에 '-'를 곱하여 사용
}
// order의 조건으로 익명함수 발생

function stableSort(array, comparator) { // sort 명령 시, 데이터를 정렬하기 위한 함수
	return array.slice().sort(comparator);
}

export default function Table() {
	const searchParams = useSearchParams();
	const pageQuery = searchParams.get('page');
	const limitQuery = searchParams.get('limit');

	const [invoices, setInvoices] = React.useState([]); // fetch로 가져온 DB의 invoices 테이블의 데이터가 포함된 배열.
	const [selected, setSelected] = React.useState([]); // 이곳에는 id값만 들어갑니다.
	const [loading, setLoading] = React.useState(true); // loading 유무를 위한 블리언 값.
	const [order, setOrder] = React.useState('desc');
	const [orderBy, setOrderBy] = React.useState('index');
	const [page, setPage] = React.useState(parseInt(pageQuery || '0', 10)); // pageQuery 값이 초기에 없을 경우 0으로 설정하여 page에 이항
	const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(limitQuery || '5', 10));

	/* 브라우저의 뒤로가기, 앞으로가기 버튼 클릭 시 setSelected([]) 실행 */
	React.useEffect(() => {
		const handlePopState = () => {
			setSelected([]);
		};
		window.addEventListener('popstate', handlePopState); //popstate 이벤트: 사용자의 세션 기록 탐색으로 인해 현재 활성화된 기록 항목이 바뀔 때 발생.
		return () => {
			window.removeEventListener('popstate', handlePopState); // 메모리 누수와 같은 문제를 방지하기 위해 언마운트 될 때 실행 됨.
		};
	}, []);
	/* // 브라우저의 뒤로가기, 앞으로가기 버튼 클릭 시 setSelected([]) 실행 */

	/* pagination 변경시 */
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
				const response = await fetch(
					'/api/invoices'
				);
				const data = await response.json();
				if (Array.isArray(data)) {
					setInvoices(data);
				} else {
					console.error('Data fetched is not an array:', data);
				}
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
		setSelected([]);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) { // 해당 체크박스가 checked 상태라면,
			const newSelected = visibleRows.map((n) => n.id); // visibleRows 배열의 값 중, 속성이 id인 값만 맵핑하여 상수 newSelected에 추가됩니다.
			setSelected(newSelected);// 선언된 newSelected로 setSelected()를 실행합니다. 그러면 selected 는 newSelected값으로 변경됩니다.
			return;
		}
		setSelected([]); // 해당 체크박스가 checked 상태가 아니라면, 이 함수로 selected의 내용을 비웁니다.
	};

	/* row 클릭 시 */
	const handleClick = (event, id) => { // 각 row의 체크박스를 선택하기 위한 함수
		const selectedIndex = selected.indexOf(id); // 선택된 매개변수가 selected의 배열에서 몇번째 인덱스의 값인지 알아낸 후, 그 값을 selectedIndex에 추가합니다.

		let newSelected = []; // newSelected라는 배열을 선언함.

		if (selectedIndex === -1) { // 선택된 값이 selected 배열에 없다면,
			newSelected = newSelected.concat(selected, id); // array.prototype.concat(): 기존 배열을 수정하지 않고 두 개 이상의 배열을 병합하는 데 사용.
			// newSelected 배열에 selected 배열과 id 값이 합쳐저 추가
		} else if (selectedIndex === 0) { // 선택된 값이 selected에 있고 그 값의 인덱스가 0이면,
			newSelected = newSelected.concat(selected.slice(1));
			// newSelected 배열에 selected 배열에서 0번 인덱스를 빼고 추가
		} else if (selectedIndex === selected.length - 1) { // 선택된 값의 인덱스가 selected값의 개수에서 1을 뺀 수와 같다면,
			// 예를 들면 기존에 3개를 선택한 상태에서 선택을 하면 4가 나오는데, 여기서 4 - 1을 하면 3이므로, 조건에 맞게 됩니다. 그렇다면
			newSelected = newSelected.concat(selected.slice(0, -1)); // selected의 0번 인덱스 부터 뒤어서 1번 인덱스를 제외한 값이 newSelected에 추가됨.
		} else if (selectedIndex > 0) { // 선택된 값의 인덱스가 0보다 크다면, 만약 그 값이 4번이라면
			newSelected = newSelected.concat(
				// selected의 맨처음과 4번 인덱스까지, 그리고 5(4 + 1)번 인덱스 부터 끝가지의 값을 newSelected에 추가
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected);
	};
	/* // row 클릭 시 */

	/* paging 관련 */
	const updatePaging = (newPage) => { // updatePaging이라는 이름의 화살표 함수에 pageOrder라는 매개변수를 선언하고,
		const params = new URLSearchParams(searchParams.toString()) // URLSearchParams 생성자 함수 선언 후, searchParams.toString()을 인수로 선언
		// URLSearchParams 생성자 함수는 URLSearchParams 객체를 생성하고 반환합니다.
		// URLSearchParams은 URL의 쿼리 문자열을 대상으로 작업할 수 있는 유틸리티 메서드를 정의합니다.
		params.set('page', newPage); // query 명이 page 인 곳에 pageOrder 값을 추가.
		window.history.pushState(null, '', `?${params.toString()}`) // history.pushState() 메서드는 브라우저의 세션 기록 스택에 항목을 추가
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		updatePaging(newPage); // newPage 매개변수의 값이 pageOrder로 전달
		setSelected([]);
	};
	/* // paging 관련 */

	/* Rows per page 관련 */
	const updateRowsPerPage = (pageOrder) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('limit', pageOrder);
		window.history.pushState(null, '', `?${params.toString()}`)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		updateRowsPerPage(parseInt(event.target.value, 10));
		setSelected([]);
	};
	/* // Rows per page 관련 */

	const EnhancedTableToolbar = (props) => {
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
	async function handleDelete(selected, setInvoices, setSelected) {
		if (window.confirm(`${selected.length}개의 파일을 삭제합니까?`)) {
			try {
				const response = await fetch(
					'/api/invoices/delete',
					{
						method: 'POST', // POST 메서드 실행
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ ids: selected }),
					});
				if (!response.ok) {
					throw new Error('Failed to delete invoices');
				}

				setInvoices((prevInvoices) =>
					prevInvoices.filter((invoice) => !selected.includes(invoice.id)) //
				);
				setSelected([]);
				alert('삭제가 완료되었습니다.');
				!(visibleRows.length - selected.length) && updatePaging(page > 0 ? page - 1 : 0);

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
					<EnhancedTableToolbar
						numSelected={selected.length}
						handleDelete={handleDelete}
					/>
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
								rowsPerPage={rowsPerPage}
								visibleRows={visibleRows.length}
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
											<TableCell>{invoice.date}</TableCell>
											<TableCell>{invoice.id}</TableCell>
											{/* <TableCell>{invoice.formatted_date}</TableCell> */}
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
