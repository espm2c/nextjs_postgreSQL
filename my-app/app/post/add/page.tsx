import { addPost } from '../../lib/actions';

export default async function Post(){
	return(
		<>
		<form action={addPost}>
			<input
			type="text"
			name="tit"
			/>
			<textarea name="sentence"></textarea>
			<button>등록</button>
		</form>
		</>
	)
}