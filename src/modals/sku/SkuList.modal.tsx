import {Button, Modal, ModalProps, Popconfirm, Space, Table, Tooltip} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {SkuHelper} from "@/common/helpers/sku.helper.tsx";
import {setSelectSku, skuSelector} from "@store/sku/sku.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {AppDispatch} from "@store/store.ts";
import SkuThunk from "@store/sku/sku.thunk.ts";
import {productSelector} from "@store/product/product.slice.ts";
import SkuCreateModal from "@/modals/sku/SkuCreate.modal.tsx";
import SkuUpdateModal from "@/modals/sku/SkuUpdate.modal.tsx";
import {OnselectRow} from "@utils/method.utils.tsx";
import {SKU} from "@/@types/repo/sku.type.ts";
import {DateUtil} from "@utils/date.util.tsx";
import HistoryModa from "@/modals/sku/History.modal";
import NotiThunk from "@/common/store/noti/noti.thunk";
import HistoryModal from "@/modals/sku/History.modal";

export default function SkuListModal(props: ModalProps) 
{
	const dispatch = useDispatch<AppDispatch>()
	const sku = useSelector(skuSelector)
	const product = useSelector(productSelector)
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		history: false
	})
	const [reload,setReload] = useState(false)
	useEffect(() => {
		if(product.select){
			dispatch(SkuThunk.list(product.select))
		}
	}, [product.select,reload]);
	
	const toggleModal = (name: string) => {
		return () => {
			setConfigModal({
				...configModal,
				[name]: !configModal[name]
			})
		}
	}
	
	const selectSku = (sku:SKU) => {
		dispatch(setSelectSku(sku))
		dispatch(NotiThunk.getById(sku._id))
	}
	const onDelete = (sku:SKU) => {
		dispatch(SkuThunk.delete(sku))
	}
	
	return (
		<div id={"SkuListModal"}>
			{
				configModal.create && (<SkuCreateModal open={configModal.create}  onCancel={toggleModal("create")} />)
			}
			{
				configModal.update && (<SkuUpdateModal open={configModal.update}  onCancel={toggleModal("update")} />)
			}
			{
				configModal.history && (<HistoryModal title={"Lịch sử cập nhật"} open={configModal.history}  onCancel={toggleModal("history")} />)
			}
			
			<Modal {...props} title={"Danh sách SKU"} width={1280} okButtonProps={{style:{display:"none"}}} cancelText={"Đóng"} >
				<Space.Compact>
					<Button type={"primary"}  onClick={toggleModal("create")} >Thêm SKU</Button>
					<Button type={"primary"} onClick={()=>{
						setReload(!reload)
					}} >Refresh</Button>
				</Space.Compact>
				<Table rowKey={"_id"} dataSource={sku.list}
					   onRow={(record:SKU) => OnselectRow(record,selectSku)}
					   loading={sku.loadings.getPage}
				>
					<Table.Column title={"STT"} render={NumberUtil.toIndex} align={"center"} />
					<Table.Column title={"Mã SKU"} dataIndex={"code"} />
					<Table.Column title={"Màu"} dataIndex={"colors"} render={SkuHelper.renderColor} />
					<Table.Column title={"Nơi nhập"} dataIndex={"importAddress"} align={"center"} />
					<Table.Column title={"Ngày nhập"} dataIndex={"createdAt"} render={DateUtil.toCreateAt} align={"center"} />
					<Table.Column title={"Hành Động"} width={100} render={(record:SKU) => {
						return (
							<Space.Compact>
								<Tooltip title={"Cập nhật"}>
									<Button type={"primary"}
									onClick={toggleModal("update")}
									>Cập nhật</Button>
								</Tooltip>
								<Tooltip title={"Lịch sử"}>
									<Button type={"primary"}
											onClick={toggleModal("history")}
									>Lịch sử</Button>
								</Tooltip>
								<Tooltip title={"Xóa"}>
									<Popconfirm title={'Bạn có chắc muốn xóa?'} okText={'Có'} cancelText={'Không'} onConfirm={()=> onDelete(record)}>
										<Button danger type={"primary"}>Xóa</Button>
									</Popconfirm>
								</Tooltip>
							</Space.Compact>
						)
					}} />
				</Table>
			</Modal>
		</div>
	)
}