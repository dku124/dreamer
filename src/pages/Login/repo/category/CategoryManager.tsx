import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@hooks/page.hook.ts";
import { AppDispatch } from "@store/store.ts";
import { useEffect, useState } from "react";
import { categorySelector, setSelectCategory } from "@store/category/category.slice.ts";
import { Button, Input, Popconfirm, Space, Table, Tooltip } from "antd";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import CategoryThunk from "@store/category/category.thunk.ts";
import { OnselectRow } from "@utils/method.utils.tsx";
import { Category } from "@/@types/repo/category.type.ts";
import { DateUtil } from "@utils/date.util.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import CategoryCreateModal from "@/modals/category/CategoryCreate.modal.tsx";
import CategoryUpdateModal from "@/modals/category/CategoryUpdate.modal.tsx";
import Pagination from "@components/pagination/paginationx.tsx";
import HistoryModal from "@/modals/sku/History.modal";
import NotiThunk from "@/common/store/noti/noti.thunk";

export default function CategoryManager() {
	const category = useSelector(categorySelector)
	const [query, setQuery] = useQuery()
	const dispatch = useDispatch<AppDispatch>()
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		history: false
	})
	useEffect(() => {
		dispatch(CategoryThunk.getPage(query))
	}, [query])

	const selectCategory = (category: Category) => {
		dispatch(setSelectCategory(category))
		dispatch(NotiThunk.getById(category._id))
	}

	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}
	return (
		<div id={`CategoryManager`}>
			{
				configModal.create && <CategoryCreateModal open={configModal.create} onCancel={toggleModal("create")} />
			}
			{
				configModal.update && <CategoryUpdateModal open={configModal.update} onCancel={toggleModal("update")} />
			}
			{
				configModal.history && (<HistoryModal title={"Lịch sử cập nhật"} open={configModal.history} onCancel={toggleModal("history")} />)
			}
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Thêm danh mục"}>
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
				<Table pagination={false} rowKey={"_id"} dataSource={category.data?.data || []}
					onRow={(record: Category) => OnselectRow(record, selectCategory)}
					loading={category.loadings.getPage}
				>
					<Table.Column title={"STT"} align={"center"} render={NumberUtil.toIndex} />
					<Table.Column title={"Tên"} dataIndex={"name"} />
					<Table.Column title={"Ngày tạo"} dataIndex={"createdAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Ngày cập nhật"} dataIndex={"updatedAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Hành động"} render={(text, record: Category) => (
						<Space.Compact>
							<Tooltip title={"Cập nhật danh mục"}>
								<Button className={"btn"} type={"primary"}
									onClick={toggleModal("update")}
								>
									Cập nhật
								</Button>
							</Tooltip>
							<Tooltip title={"Xóa danh mục"}>
								<Popconfirm title={"Bạn có chắc chắn muốn xóa danh mục này?"}
									onConfirm={e => dispatch(CategoryThunk.delete(record))}
								>
									<Button className={"btn"} type={"primary"} danger >Xóa</Button>
								</Popconfirm>
							</Tooltip>
							<Tooltip title={"Lịch sử"}>
								<Button type={"primary"}
									onClick={toggleModal("history")}
								>Lịch sử</Button>
							</Tooltip>
						</Space.Compact>
					)} />
				</Table>
				<Pagination query={query} onChange={setQuery} page={category.data} />
			</div>
		</div>
	)
}