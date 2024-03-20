import { useDispatch, useSelector } from "react-redux";
import { productSelector, setSelectProduct } from "@store/product/product.slice.ts";
import { Button, Divider, Input, Popconfirm, Select, Space, Table, Tooltip } from "antd";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { useQuery } from "@hooks/page.hook.ts";
import { AppDispatch } from "@store/store.ts";
import { useEffect, useState } from "react";
import { OnselectRow } from "@utils/method.utils.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import Pagination from "@components/pagination/paginationx.tsx";
import { Product } from "@/@types/repo/product.type.ts";
import ProductThunk from "@store/product/product.thunk.ts";
import { ProductHelper } from "@/common/helpers/product.helper.tsx";
import ProductCreateModal from "@/modals/product/ProductCreate.modal.tsx";
import ProductUpdateModal from "@/modals/product/ProductUpdate.modal.tsx";
import SkuListModal from "@/modals/sku/SkuList.modal.tsx";
import { SupplierHelper } from "@/common/helpers/supplier.helper.tsx";
import SupplierThunk from "@store/supplier/supplier.thunk.ts";
import { supplierSelector } from "@store/supplier/supplier.slice.ts";
import { categorySelector } from "@store/category/category.slice.ts";
import CategoryThunk from "@store/category/category.thunk.ts";
import { CategoryHelper } from "@/common/helpers/category.helper.tsx";
import { FaCameraRetro } from "react-icons/fa";
import HistoryModa from "@/modals/sku/History.modal";
import NotiThunk from "@/common/store/noti/noti.thunk";
import HistoryModal from "@/modals/sku/History.modal";

export default function ProductManager() {
	const product = useSelector(productSelector)
	const supplier = useSelector(supplierSelector)
	const category = useSelector(categorySelector)
	const [query, setQuery] = useQuery({
		limit: 9,
	})
	const dispatch = useDispatch<AppDispatch>()
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		sku: false,
		history: false
	})

	useEffect(() => {
		dispatch(SupplierThunk.list())
		dispatch(CategoryThunk.list())
	}, []);

	useEffect(() => {
		dispatch(ProductThunk.getPage(query))
	}, [query]);


	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}

	const selectProduct = (product: Product) => {
		dispatch(setSelectProduct(product))
		dispatch(NotiThunk.getById(product._id))
	}

	const deleteProduct = (product: Product) => {
		dispatch(ProductThunk.delete(product))
	}

	const uploadFile = (e: any) => {
		const file = e.target.files[0]
		if (file) {
			const formData = new FormData()
			formData.append("img", file)
			dispatch(ProductThunk.uploadImage({
				product: product.select as Product,
				data: formData
			}))
		}
	}



	return (
		<div id={"ProductManager"}>
			{
				configModal.create && <ProductCreateModal open={configModal.create} onCancel={toggleModal("create")} />
			}
			{
				configModal.update && <ProductUpdateModal open={configModal.update} onCancel={toggleModal("update")} />
			}
			{
				configModal.sku && <SkuListModal open={configModal.sku} onCancel={toggleModal("sku")} />
			}
			{
				configModal.history && (<HistoryModal title={"Lịch sử cập nhật"} open={configModal.history} onCancel={toggleModal("history")} />)
			}
			<input
				type={"file"} id={"file"} style={{ display: "none" }}
				accept={"image/*"} multiple={false}
				onChange={uploadFile}
			/>
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Thêm sản phẩm"}>
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
					<Space.Compact>
						<Select
							style={{ width: "max-content", minWidth: "150px", height: "100%" }}
							placeholder={"Tất cả"} options={CategoryHelper.toOptions(category.list)}
							onChange={(e) => {
								setQuery({ ...query, category: e, page: 1 })
							}}
						/>
						<Select
							style={{ width: "max-content", minWidth: "150px", height: "100%" }}
							placeholder={"Tất cả"} options={SupplierHelper.toOptions(supplier.list)}
							onChange={(e) => {
								setQuery({ ...query, supplier: e, page: 1 })
							}}
						/>
						<Input.Search
							allowClear className={"input-search"}
							placeholder={"Tìm kiếm"} width={"300px"}
							onSearch={e => setQuery({ query: e, page: 1 })} enterButton
						/>
					</Space.Compact>
				</div>
			</div>
			<div className={"body-control"}>
				<Table pagination={false} rowKey={"_id"} dataSource={product.data?.data || []}
					onRow={(record: Product) => OnselectRow(record, selectProduct)}
					loading={product.loadings.getPage}
				>
					<Table.Column title={"STT"} align={"center"} render={NumberUtil.toIndex} />
					<Table.Column title={"Mã sản phẩm"} dataIndex={"code"} width={150} />
					<Table.Column title={"Tên sản phẩm"} dataIndex={"name"} />
					<Table.Column title={"Hình ảnh"} width={200} render={ProductHelper.renderImg} />
					<Table.Column title={"Hành động"} width={350} render={(_, record: Product) => {
						return (
							<div >
								<Space.Compact>
									<Tooltip title={"Cập nhật sản phẩm"}>
										<Button type={"primary"} onClick={toggleModal("update")}>Cập nhật</Button>
									</Tooltip>
									<Tooltip title={"Xóa sản phẩm"}>
										<Popconfirm
											title={"Bạn có chắc chắn muốn xóa sản phẩm này?"}
											onConfirm={() => deleteProduct(record)}
										>
											<Button type={"primary"} danger >Xóa</Button>
										</Popconfirm>
									</Tooltip>
									<Tooltip title={"Cập nhật hình ảnh"}>
										<Button type={"primary"} onClick={() => document.getElementById("file")?.click()} ><FaCameraRetro /></Button>
									</Tooltip>
									<Tooltip title={"Cập nhật SKU"}>
										<Button type={"primary"} onClick={toggleModal("sku")} >Cập nhật SKU</Button>
									</Tooltip>
									<Tooltip title={"Lịch sử"}>
										<Button type={"primary"}
											onClick={toggleModal("history")}
										>Lịch sử</Button>
									</Tooltip>
								</Space.Compact>
							</div>
						)
					}} />
				</Table>
				<Pagination query={query} onChange={setQuery} page={product.data} />
			</div>
		</div>
	)
}