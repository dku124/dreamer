import { Button, Input, Popconfirm, Space, Table, Tooltip } from "antd";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { useEffect, useState } from "react";
import { setSelectSupplier, supplierSelector } from "@store/supplier/supplier.slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@hooks/page.hook.ts";
import { AppDispatch } from "@store/store.ts";
import { Supplier } from "@/@types/repo/supplier.type.ts";
import { OnselectRow } from "@utils/method.utils.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import { SupplierHelper } from "@/common/helpers/supplier.helper.tsx";
import SupplierThunk from "@store/supplier/supplier.thunk.ts";
import SupplierCreateModal from "@/modals/supplier/SupplierCreate.modal.tsx";
import SupplierUpdateModal from "@/modals/supplier/SupplierUpdate.modal.tsx";
import Pagination from "@components/pagination/paginationx.tsx";
import HistoryModal from "@/modals/sku/History.modal";
import NotiThunk from "@/common/store/noti/noti.thunk";

export default function SupplierManager() {

	const supplier = useSelector(supplierSelector)
	const [query, setQuery] = useQuery()
	const dispatch = useDispatch<AppDispatch>()
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		history:false
	})

	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}

	const selectSupplier = (supplier: Supplier) => {
		dispatch(setSelectSupplier(supplier))
		dispatch(NotiThunk.getById(supplier._id))
	}

	const deleteSupplier = (supplier: Supplier) => {
		dispatch(SupplierThunk.delete(supplier))
	}


	useEffect(() => {
		dispatch(SupplierThunk.getPage(query))
	}, [query])




	return (
		<div id={"SupplierManager"}>
			{configModal.create && <SupplierCreateModal open={configModal.create} onCancel={toggleModal("create")} />}
			{configModal.update && <SupplierUpdateModal open={configModal.update} onCancel={toggleModal("update")} />}
			{
				configModal.history && (<HistoryModal title={"Lịch sử cập nhật"} open={configModal.history} onCancel={toggleModal("history")} />)
			}
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Thêm nhà cung cấp"}>
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
				<Table pagination={false} rowKey={"_id"} dataSource={supplier.data?.data || []}
					onRow={(record: Supplier) => OnselectRow(record, selectSupplier)}
					loading={supplier.loadings.getPage}
				>
					<Table.Column title={"STT"} align={"center"} render={NumberUtil.toIndex} />
					<Table.Column title={"Tên"} dataIndex={"name"} />
					<Table.Column title={"Tên ngắn gọn "} dataIndex={"shortName"} />
					<Table.Column title={"Số điện thoại"} dataIndex={"phones"} render={SupplierHelper.toPhones} />
					<Table.Column title={"Hành động"} render={(_, record: Supplier) => {
						return (
							<Space.Compact>
								<Tooltip title={"Cập nhật nhà cung cấp"}>
									<Button type={"primary"} onClick={toggleModal("update")}>Cập nhật</Button>
								</Tooltip>
								<Tooltip title={"Xóa nhà cung cấp"}>
									<Popconfirm
										title={"Bạn có chắc chắn muốn xóa nhà cung cấp này?"}
										onConfirm={() => deleteSupplier(record)}
									>
										<Button type={"primary"} danger >Xóa</Button>
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
				<Pagination query={query} onChange={setQuery} page={supplier.data} />
			</div>
		</div>
	)
}