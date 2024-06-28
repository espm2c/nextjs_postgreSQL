'use client'
import { useState } from 'react';
import { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

/* const ListInvoices = lazy(() => import('@/app/components/listInvoices')); */
const ListInvoices = dynamic(() => import('@/app/components/listInvoices'));

export default function Ex() {
	const [num, setNum] = useState(0);

	const addNum = () => {
		setNum(num + 1);
	}
	return (
		<>
			<h1>Client Side Rendering</h1>
			<p>{num}</p>
			<button onClick={addNum}>+1</button>
			<div className='border-2 border-solid border-blue-400 p-2'>
				<h2 className='m-0'>Server Component</h2>
				{/* <Suspense fallback={<div>Loading...</div>}>
					<ListInvoices />
				</Suspense> */}
				<ListInvoices />
			</div>

		</>
	)
}