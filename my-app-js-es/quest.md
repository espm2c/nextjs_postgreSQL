React,
Nextjs,
	-App router

PostgreSQL

.env



1. 하나의 페이지에서 분리된 컴포넌트를 호출하여 페이지 제작. 서버 컴포넌트와 클라이언트 컴포넌트를 같이 사용할 수 있는지 확인.
	-	일단 안됨. 다른 방법이 있는지 검색중.

2. 멀티데이터 삭제시, 삭제 명령이 n개 전송됨. 한번에 전송될 수 있게 수정하기.
	- 수정 완료. 기존 map으로 삭제 진행되는 것을 변경

3. 데이터 추가시, 해당페이지가 2회 호출됨(invoice). 1회 호출로 수정하기.
	- \app\api\invoices\route.js가 2회 실행됨
	- React 18버전에서 Strict Mode는 개발 환경에서 추가적인 개발자 피드백을 제공하기 위해 일부 생명주기 메서드와 useEffect 같은 훅을 두 번씩 호출합니다.
		my-app-js-es\next.config.mjs 에서
			/** @type {import('next').NextConfig} */
			const nextConfig = {
				reactStrictMode: false,
			};

			export default nextConfig;
		로 수정. 그러나 추천하지 않는 방법.
		왜? strict mode를 사용하여야 하는가?
		개발 중 디버깅을 위해 사용. 프로덕션 환경에서는 비활성화를 하는 것이 일반적이라 합니다.



4. 전체 선택 체크박스 활성시, 모든 데이터가 선택됨. 현재 보이는 데이터만 선택 될 수 있게 수정하기.
	- enhancedTableHead 수정

5. 현재 보이는 데이터를 모두 삭제시, 데이터가 보일 수 있게 변경하기. (마지막 데이터 삭제 시, 앞쪽 데이터가 보일 수 있게 변경하기)
	- handleDelete()에 !(visibleRows.length - selected.length) && updatePaging(page > 0 ? page - 1:0); 조건문 추가

6. 데이터 행의 체크박스 선택 -> 페이지네이션으로 다음 데이터를 호출 -> 그리고 이전 데이터 호출 시 앞에서 선택된 체크박스가 삭제되게 수정하기.
	- handleChangePage() 실행시 setSelected([])가 실행되어 체크박스가 해제되게 수정
	-그러나, 브라우저 뒤로가기를 클릭할 경우, 체크박스가 해제되지 않음.


7. date의 정렬을 날짜(년, 월, 일)로 정렬되게 수정하기.


!! Error getting selection range: DOMException: Failed to execute 'getRangeAt' on 'Selection': 0 is not a valid index. 이 에러는 왜 나오는 것인가?
Selection 객체에서 범위를 가져올 때, 선택된 텍스트가 없는 상태에서 getRangeAt 메서드를 호출할 때 발생합니다. 이 문제를 해결하려면 Selection 객체가 유효한지 확인하고, 유효하지 않은 경우 처리를 건너뛰는 방식으로 접근할 수 있습니다.



2024-06-26

1. Nextjs에서 한 페이지에서 Server Component 와 client Comp를 같이 불러와 사용할 수 없는가?

2. date 형식을 변경하여 데이터 불러오기.
	PostgreSQL에서 admin으로 접속 후, 쿼리를 날리면서 수정하기.


	SELECT to_char(to_date(date, 'Dy Mon DD YYYY'), 'yyyy-mm-dd') AS formatted_date FROM invoices;