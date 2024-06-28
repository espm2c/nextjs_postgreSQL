import { NextResponse } from 'next/server';
import { getCustomers } from '../../lib/queries';

export async function GET() { // 요청을 받으면 function GET 실행. 매개변수는 request
	try {
		const customers = await getCustomers();
		return NextResponse.json({ customers }); // NextResponse사용 시 간단하게 사용가능. costomers를 json 형식으로 생성
		/*
			return new Response(
				JSON.stringify(customers),	 	// 이 부분은 body
				{															// 이 부분은 options
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			이것을 간단히
				return NextResponse.json({ customers })
			으로 사용가능.
		*/
	} catch (error) {
		console.error('Error fetching invoices:', error);
		return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 }); // NextResponse사용 시
	}
}
