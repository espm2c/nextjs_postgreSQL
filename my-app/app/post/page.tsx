import Link from "next/link";
import { Post } from "../lib/queries";
import { formatDateToLocal } from '@/app/lib/utils';

async function fetchPost(): Promise<Post[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
	if (!res.ok) {
		throw new Error('Failed to fetch posts');
	}
	const data = await res.json(); // res를 json 형식으로 변경
	return data.posts; // 배열로 리턴
}

export default async function Post() {
	const posts = await fetchPost();
	console.log(posts);
	return (
		<>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>제목</th>
						<th>날짜</th>
					</tr>
				</thead>
				<tbody>
					{posts.map(post => (
						<tr key={post.index}>
							<td>{post.index}</td>
							<td><Link href="/">{post.tit}</Link></td>
							<td>{formatDateToLocal(post.date)}</td>
						</tr>
					))}
				</tbody>
			</table>
			<Link href="/post/add">글쓰기</Link>
		</>
	)
}