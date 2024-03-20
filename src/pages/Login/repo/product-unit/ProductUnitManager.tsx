import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@store/store.ts";
import { useEffect, useState } from "react";
import { useQuery } from "@hooks/page.hook.ts";
import { Button, Input, Popconfirm, Space, Table, Tooltip } from "antd";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { ProductUnit } from "@/@types/repo/product-unit.type.ts";
import { productUnitSelector, setSelectProductUnit } from "@store/product-unit/product-unit.slice.ts";
import productUnitThunk from "@store/product-unit/product-unit.thunk.ts";
import { OnselectRow } from "@utils/method.utils.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import Pagination from "@components/pagination/paginationx.tsx";
import ProductUnitCreateModal from "@/modals/product-unit/ProductUnitCreate.modal.tsx";
import ProductUnitUpdateModal from "@/modals/product-unit/ProductUnitUpdate.modal.tsx";
import { DateUtil } from "@utils/date.util.tsx";
import HistoryModal from "@/modals/sku/History.modal";
import NotiThunk from "@/common/store/noti/noti.thunk";

export default function ProductUnitManager() {
	const dispatch = useDispatch<AppDispatch>()
	const productUnit = useSelector(productUnitSelector)
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		history: false
	})
	const [query, setQuery] = useQuery()

	useEffect(() => {
		dispatch(productUnitThunk.getPage(query))
	}, [query]);


	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}

	const selectProductUnit = (productUnit: ProductUnit) => {
		dispatch(setSelectProductUnit(productUnit))
		dispatch(NotiThunk.getById(productUnit._id))
	}

	return (
		<div id={"ProductUnitManager"}>
			{
				configModal.create && <ProductUnitCreateModal open={configModal.create} onCancel={toggleModal("create")} />
			}
			{
				configModal.update && <ProductUnitUpdateModal open={configModal.update} onCancel={toggleModal("update")} />
			}
			{
				configModal.history && (<HistoryModal title={"Lịch sử cập nhật"} open={configModal.history} onCancel={toggleModal("history")} />)
			}
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Thêm đơn vị"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoMdAdd />}
							onClick={toggleModal("create")}
						/>
					</Tooltip>
					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoReload />}
							onClick={e => setQuery({ ...query })}
						/>
					</Tooltip>
				</div>
				<div>
					<Input.Search
						allowClear className={"input-search"}
						placeholder={"Tìm kiếm"} width={"300px"}
						onSearch={e => setQuery({ query: e, page: 1 })} enterButton
					/>
				</div>
			</div>
			<div className={"body-control"}>
				<Table pagination={false} rowKey={"_id"} dataSource={productUnit.data?.data || []}
					onRow={(record: ProductUnit) => OnselectRow(record, selectProductUnit)}
					loading={productUnit.loadings.getPage}
				>
					<Table.Column title={"STT"} render={NumberUtil.toIndex} align={"center"} />
					<Table.Column title={"Tên đơn vị"} dataIndex={"name"} />
					<Table.Column title={"Ngày tạo"} dataIndex={"createdAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Ngày cập nhật"} dataIndex={"updatedAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Hành động"} render={(_, record: ProductUnit) => {
						return (
							<Space.Compact>
								<Tooltip title={"Cập nhật đơn vị kho"}>
									<Button type={"primary"} onClick={toggleModal("update")} >Cập nhật</Button>
								</Tooltip>
								<Tooltip title={"Xóa đơn vị kho"}>
									<Popconfirm
										title={"Bạn có chắc chắn muốn xóa đơn vị kho này không?"}
										onConfirm={e => dispatch(productUnitThunk.delete(record))}
										okText={"Xóa"} cancelText={"Hủy"} >
										<Button type={"primary"} danger={true}>Xóa</Button>
									</Popconfirm>
								</Tooltip>
								<Tooltip title={"Lịch sử"}>
									<Button type={"primary"}
										onClick={toggleModal("history")}
									>Lịch sử</Button>
								</Tooltip>
							</Space.Compact>
						)
					}} />
				</Table>
			</div>
			<Pagination query={query} onChange={setQuery} page={productUnit.data} />
		</div>
	)
}