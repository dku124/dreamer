import {Button, Space, Table} from "antd";
import {useDispatch} from "react-redux";
import {setAdSelect} from "@store/camp/camp.slice.ts";
import {Camp} from "@/@types/camp/camp.type.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {CampHelper} from "@/common/helpers/camp.helper.tsx";
import {Ad} from "@/@types/camp/ad.type.ts";
import {AppDispatch} from "@store/store.ts";
import {useState} from "react";
import {AdUpdateModal} from "@/modals/ad/AdUpdate.modal.tsx";


interface CampDetailTableProps
{
	record:Camp
	query?:Record<string,any>
}

export function CampDetailTable(props:CampDetailTableProps)
{
	
	const dispatch = useDispatch<AppDispatch>()
	const [configModal,setConfigModal] = useState<Record<string, boolean>>({
		update: false
	})
	
	const toggleModal = (modal:string) => {
		return () => {
			setConfigModal({...configModal,[modal]:!configModal[modal]})
		}
	}
	const coverData=(camp?:Camp) => {
	
		return camp?.ads?.map((e,index) => {
			return {
				key:index,
				...camp,
				...e,
			}
		}) || []
	
	}
	return(
		<div>
			{ configModal.update && <AdUpdateModal open={configModal.update} onCancel={toggleModal("update")} />}
			<Table dataSource={coverData(props.record)}
				   pagination={false}
				   onRow={(record:Ad) => {
					   return {
						   onClick:() => {
							   dispatch(setAdSelect(record))
						   }
					   }
				   }}
			>
				<Table.Column title={"STT"} align={"center"} width={100} render={NumberUtil.toIndex} />
				<Table.Column title={"Tên"}  align={"left"} width={150} dataIndex={"campaign_name"} />
				<Table.Column title={"Đơn vị tiền"} align={"left"} width={100} render={CampHelper.toCurrency} />
				<Table.Column title={"Chi phí QC"} align={"center"} width={150} render={CampHelper.toSpend} />
				<Table.Column title={"Số Click"} align={"center"} width={100} dataIndex={"clicks"} render={NumberUtil.toNumberMoney} />
				<Table.Column title={"CPM"}   align={"center"} width={150}  render={CampHelper.toCPM} />
				<Table.Column title={"CPC"}  align={"center"} width={150}  render={CampHelper.toCPC} />
				<Table.Column title={"Hành động"} width={210} align={"center"} fixed={"right"} render={(_,record:Camp)=>{
					return <Space.Compact>
						{
							props.query?.from === props.query?.to && <Button type={"primary"}
																			 onClick={toggleModal("update")}
							>Cập nhật</Button>
						}
					</Space.Compact>
				}} />
			</Table>
		</div>
	)
}