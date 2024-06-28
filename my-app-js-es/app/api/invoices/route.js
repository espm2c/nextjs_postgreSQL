/*
	Route Handler
	Route Handler는 당신이 커스텀 요청 핸들러(웹 Request 및 Response APIs를 사용하는 하나 주어진 라우트)를 생성하는 것을 허락합니다.

	(Route Handlers)는 우리가 컴퓨터에게 어떤 일을 해달라고 요청하는 방법과 그 대답을 처리하는 방법을 사용해서, 우리가 원하는 대로 요청을 처리할 수 있게 해주는 도구예요
*/


import { getInvoices } from '../../lib/queries';

export async function GET(request) {
	try {
		const invoices = await getInvoices();
		/*
			getInvoices를 실행하여 해당 내용을 invoices 상수에 담는다.
			이 함수는 데이터베이스에 데이터를 가져오는 함수다.(SELECT ... FROM ...)
			해당되는 함수들이 invoice함수에 담긴다.
		*/

		/* new Response(body, options) */
		return new Response( // 이 부분을 응답(response)으로 반환한다.
			JSON.stringify(invoices), // body: invoices(이것은 배열(object))를 JSON문자열화 한다.
			{
				status: 200, // 상태는 200(ok)
				headers: {
					'Content-Type': 'application/json', // content type을 json 형태로 한다.
				},
			});
	} catch (error) {
		// 만약 에러라면,
		console.error('Error fetching invoices:', error);
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }), // 해당 object를 JSON문자열화하여 반환한다.
			{
				status: 500, // 상태는 200(internal server error)
				headers: {
					'Content-Type': 'application/json',
				},
			});
	}
}

