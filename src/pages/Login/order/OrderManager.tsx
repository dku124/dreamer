import {useQuery} from "@hooks/page.hook.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect, useState} from "react";
import {Button, Checkbox, DatePicker, Input, Select, Space, Table, Tabs, Tooltip} from "antd";
import {IoMdAdd} from "react-icons/io";
import {IoReload, IoSettings} from "react-icons/io5";
import {ProductHelper} from "@/common/helpers/product.helper.tsx";
import {tabItems} from "@pages/login/order/OrderItem.tsx";
import './OrderManager.scss'
import {clearDetail, orderSelector, setSelectOrder} from "@store/order/order.slice.ts";
import OrderThunk from "@store/order/order.thunk.ts";
import dayjs from "dayjs";
import {DateUtil} from "@utils/date.util.tsx";
import {NumberUtil} from "@utils/number.util.ts";
import {Shipping} from "@/@types/order/ship.type.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {Order, OrderStatus} from "@/@types/order/order.type.ts";
import {OrderCreateModal} from "@/modals/order/OrderCreate.modal.tsx";
import {OrderUpdateModal} from "@/modals/order/OrderUpdate.modal.tsx";
import {OnselectRow} from "@utils/method.utils.tsx";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import Pagination from "@components/pagination/paginationx.tsx";
import {authSelector} from "@store/auth/auth.slice.ts";
import {UserRole} from "@/@types/user.type.ts";
import {OrderUpdateNoteModal} from "@/modals/order/OrderUpdateNote.modal.tsx";
import {ShipTimeLineModal} from "@/modals/ship/shipTimeline.modal";

export default function OrderManager() {
	const [query, setQuery] = useQuery({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
	})
	const dispatch = useDispatch<AppDispatch>()
	const order = useSelector(orderSelector)
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		updateNote: false,
		timeline: false,
	})
	const auth = useSelector(authSelector)
	const toggleModal = (modal: string) => {

		return () => {
			dispatch(clearDetail())
			if (!configModal[modal]) {
				dispatch(setSelectOrder(undefined))
			}
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}

	useEffect(() => {
		dispatch(OrderThunk.getPage(query))
	}, [query]);

	const selectOrder = (order: Order) => {
		dispatch(setSelectOrder(order))
	}


	return (
		<div id={"OrderManager"}>
			{
				configModal.create && (<OrderCreateModal open={configModal.create} onCancel={toggleModal("create")} />)
			}
			{
				configModal.update && (<OrderUpdateModal open={configModal.update} onCancel={toggleModal("update")} />)
			}
			{
				configModal.updateNote && (<OrderUpdateNoteModal open={configModal.updateNote} onCancel={toggleModal("updateNote")} />)
			}
			{
				configModal.timeline && (<ShipTimeLineModal open={configModal.timeline} onCancel={toggleModal("timeline")} />)
			}
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Thêm đơn hàng"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoMdAdd />}
							onClick={toggleModal("create")}
						/>
					</Tooltip>
					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoReload />}
							onClick={_e => setQuery({ ...query })}
						/>
					</Tooltip>
					<Tooltip title={"Cấu hình"}>
						<Button className={"btn"} shape={"circle"}
								type={"primary"} icon={<IoSettings />}
								onClick={_e => setQuery({ ...query })}
						/>
					</Tooltip>
					{
						query.status == OrderStatus.CONFIRMED && (<Tooltip title={"Giao hàng thất bại"}>
							<Checkbox checked={query?.deliveryFailed || false} onChange={e => setQuery({ ...query, deliveryFailed: e.target.checked })}>Giao hàng thất bại</Checkbox>
						</Tooltip>)
					}
				</div>
				<div>
					<Space.Compact>
						<DatePicker.RangePicker
							value={[
								dayjs(query.from, DateUtil.dateFormat),
								dayjs(query.to, DateUtil.dateFormat)
							]}

							onChange={(_, e: Array<string>) => {
								if (_) {
									setQuery({
										...query,
										from: e[0],
										to: e[1],
										page: 1
									})
								}
								else {
									setQuery({
										...query,
										from: "20/11/2002",
										to: "20/11/2222",
										page: 1
									})
								}
							}}
							format={DateUtil.dateFormat}
							renderExtraFooter={() => {
								return DateUtil.DatePickerFooter(setQuery)
							}}
						/>
						<Select
							style={{ width: "max-content", minWidth: "150px", height: "100%" }}
							placeholder={"Tất cả"} options={ProductHelper.toOptionsTag()}
							onChange={e => setQuery({ tag: e === "" ? undefined : e, page: 1 })}
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
				<div className={"tabs"}>
					<Tabs items={tabItems(order?.data)} centered={true}
						onChange={e => setQuery({ status: e, page: 1 })}

					/>
				</div>
				<div className={"table"}>
					<Table className={"table"} dataSource={order?.data?.data} rowKey={"_id"}
						scroll={{ x: 2500 }} pagination={false}
						onRow={(record: Order) => OnselectRow(record, selectOrder)}
						loading={order.loadings.getPage}
					>
						{/*{*/}
						{/*	['stt'].length > 0 ? ['stt'].map((e)=>{*/}
						{/*		*/}
						{/*		const col = collums[e]*/}
						{/*		return <Table.Column title={col.title} align={col.align} width={70} render={col.render} />*/}
						{/*	}):Object.keys(collums).map((e)=>{*/}
						{/*		*/}
						{/*		const col = collums[e]*/}
						{/*		return <Table.Column title={col.title} align={col.align} width={70} render={col.render} />*/}
						{/*	})*/}
						{/*}*/}
						<Table.Column title={"STT"} align={"center"} width={70} render={NumberUtil.toIndex} />
						<Table.Column title={"Mã đơn hàng"} dataIndex={"code"} align={"center"} width={150} />
						<Table.Column title={"Tên khách hàng"} dataIndex={"ship"} width={200} render={(ship: Shipping) => ship.to.fullName} />
						<Table.Column title={"Số điện thoại"} dataIndex={"ship"} width={120} render={(ship: Shipping) => ship.to.phone} />
						<Table.Column title={"Địa chỉ"} dataIndex={"ship"} width={250} render={(ship: Shipping) => ship.to.address} />
						<Table.Column title={"Mã vùng"} dataIndex={"ship"} width={100} render={ShipHelper.toProviderShortName} />
						<Table.Column title={"Mã sản phẩm - Tên sản phẩm - Số lượng - SKU"} dataIndex={"details"} width={400} render={OrderHelper.ToProduct} />
						<Table.Column title={"Cảnh báo"} dataIndex={"addOnInfo"} width={100} render={OrderHelper.toWarning} />
						<Table.Column title={"Trạng thái"} dataIndex={"status"} align={"center"} width={150} render={OrderHelper.Status} />
						<Table.Column title={"Ghi chú"} width={200} render={(order: Order) => order?.note} />
						<Table.Column title={"Ngày tạo"} dataIndex={"createdAt"} width={200} render={DateUtil.toLocaleString} />
						{
							auth.roles.includes(UserRole.ADMIN) && (<Table.Column title={"Nhân viên phụ trách"} dataIndex={"sale"} width={200} render={OrderHelper.toComfirmUser} />)
						}
						<Table.Column title={"Thời gian chốt"} dataIndex={"timeConfirm"} width={200} render={OrderHelper.timeConfirm} />
						<Table.Column title={"Nhân viên chốt"} dataIndex={"userConfirm"} width={200} render={OrderHelper.toComfirmUser} />
						<Table.Column title={"Nguồn đơn"} dataIndex={"addOnInfo"} width={200} render={OrderHelper.SourceOrder} />
						<Table.Column title={"Nguồn hàng"} dataIndex={"details"} width={150} render={ProductHelper.toSrc} />
						<Table.Column title={"Hành động"} width={230} align={"center"} fixed={"right"} render={(order: Order) => {
							return (
								<Space.Compact>
									{order.status != OrderStatus.CONFIRMED && (<Button type={"primary"}
										onClick={toggleModal("update")}
									>Cập nhật</Button>)}
									{
										order.status == OrderStatus.CONFIRMED && (<Button type={"primary"} onClick={toggleModal("updateNote")}>Ghi chú đơn</Button>)
									}
									{
										order.status == OrderStatus.CONFIRMED && (<Button type={"primary"}
											onClick={toggleModal("timeline")}
										>Lịch sử</Button>)
									}
								</Space.Compact>
							)
						}} />
					</Table>
					<Pagination query={query} onChange={setQuery} page={order.data} />
				</div>
			</div>
		</div>
	)
}