'use client'
import {useState} from 'react';

export default function Ex(){
	const [num, setNum] = useState(0);

	const addNum = () => {
		setNum(num + 1);
	}
	return(
		<>

	<p>{num}</p>
	<button onClick={addNum}>+1</button>
		</>
	)
}