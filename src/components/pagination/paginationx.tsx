import {Pagination as PaginationOld} from 'antd';


type Props = {
	total?: number;
	query?: Query;
	onChange?: ((e: Partial<Query>) => void) | Partial<Query>;
	page: Page<any>;
	showSizeChanger?: boolean;
}


export default function Pagination(props: Partial<Props>) {

	const onChange = (page: number, size: number) => {
		if (props.onChange instanceof Function) {
			props.onChange({page: page,limit: size});
		}
	}
	return (
		<div className={"pagination"} style={{
			marginTop: "10px",
			display: "flex",
			justifyContent: "flex-end",
			alignItems: "center",
			padding: "10px 0",
		}}>
			{
				props && (<PaginationOld
					current={props?.query?.page || props.page?.meta?.page}
					total={ props.page?.meta?.total}
					defaultPageSize={props.query?.limit || props.page?.meta?.limit}
					onChange={onChange}
					showSizeChanger={true}/>)
			}
		</div>
	);
}
