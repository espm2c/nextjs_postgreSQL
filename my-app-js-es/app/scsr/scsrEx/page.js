import ListInvoices from "@/app/components/listInvoices";
import Ex from "@/app/components/exusestate";
export default function Page() {
  return (
    <>
		<h1>SSR import S.Comp and C.Comp</h1>
		<div className='border-2 border-solid border-blue-400 p-2'>
				<h2 className='m-0'>Server Component</h2>
			<ListInvoices></ListInvoices>
		</div>
		<div className='border-2 border-solid border-red-400 p-2'>
				<h2 className='m-0'>Client Component</h2>
			<Ex></Ex>
		</div>
		</>
  );
}