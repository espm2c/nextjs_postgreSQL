import React from 'react';
/*

async function fetchCustomers() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/customers` // 해당 경로에 요청
	);
	if (!res.ok) {
		throw new Error('Failed to fetch customers');
	}
	const data = await res.json();
	return data.customers;
}

export default async function ListInvoices() {
	const customers = await fetchCustomers();
	return (
		<>
			<h3>Invoices</h3>
			<ul>
				{customers.map((customer) => (
					<li key={customer.id} value={customer.id}>
						{customer.name}
					</li>
				))}
			</ul>
		</>
	)
}

*/



export async function getServerSideProps() {
	try{
		// API에서 데이터 가져오기
		const res = await fetch(
			`http://localhost:3000/api/customers`, // 해당 경로에 요청
			{ next: { revalidate: 1 } }
		);
		if (!res.ok) {
			throw new Error('Failed to fetch customers');
		}
		const data = await res.json();
		// 가져온 데이터를 props로 전달
		return {
			props: {
				customers: data,
			},
		}
	}catch(error){
    console.error('Error fetching invoices:', error);
    return {
      props: {
        customers: [], // 오류 처리 후 기본값 설정
      },
    };
	}
}

export default function ListInvoices({ customers }) {
	if (!customers || customers.length === 0) {
    return <p>No invoices found.</p>; // 데이터가 없는 경우 처리
  }
	return (
		<>
			<h3>Invoices</h3>
			<ul>
				{customers.map((customer) => (
					<li key={customer.id} value={customer.id}>
						{customer.name}
					</li>
				))}
			</ul>

		</>
	)
}