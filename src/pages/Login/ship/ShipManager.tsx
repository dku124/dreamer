import {useQuery} from "@hooks/page.hook.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {clearDetail, orderSelector, setCreateShipLoading, setSelectOrder} from "@store/order/order.slice.ts";
import {useEffect, useState} from "react";
import OrderThunk from "@store/order/order.thunk.ts";
import {Order, OrderStatus, ShipStatus} from "@/@types/order/order.type.ts";
import {OrderCreateModal} from "@/modals/order/OrderCreate.modal.tsx";
import {Button, Checkbox, DatePicker, Input, Select, Space, Table, Tabs, Tag, Tooltip, Typography} from "antd";
import {IoReload} from "react-icons/io5";
import dayjs from "dayjs";
import {OnselectRow} from "@utils/method.utils.tsx";
import {NumberUtil} from "@utils/number.util.ts";
import {Shipping, ShipType} from "@/@types/order/ship.type.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {MapUtil} from "@utils/map.util.ts";
import {OrderDetail} from "@/@types/order/detail.type.ts";
import {ShipDetailModal} from "@/modals/ship/shipDetail.modal.tsx";
import Pagination from "@components/pagination/paginationx.tsx";
import shipService from "@/services/order/ship.service.ts";
import {ShipTimeLineModal} from "@/modals/ship/shipTimeline.modal";
// @ts-ignore
import {tabItemsShip} from "@pages/Login/ship/ShipItem.tsx";
import {UpdateShipInforOrderModal} from "@/modals/ship/shipUpdateInfor.modal";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {ProductHelper} from "@/common/helpers/product.helper.tsx";

export default function ShipManager() {
	const [query, setQuery] = useQuery({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		status: OrderStatus.CONFIRMED
	})
	const dispatch = useDispatch<AppDispatch>()
	const [ids, setIds] = useState<Array<string>>([])
	const order = useSelector(orderSelector)
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		timeline: false,
		updateInfor: false,
		shipAsync : false
	})

	const toggleModal = (modal: string) => {

		return () => {
			dispatch(clearDetail())
			if (configModal[modal] === false) {
				dispatch(setSelectOrder(undefined))
			}
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}

	useEffect(() => {
		dispatch(OrderThunk.getPage(query))
		setIds([])
	}, [query]);

	const selectOrder = (order: Order) => {
		dispatch(setSelectOrder(order))
	}

	const selectAll = () => {
		if (ids.length > 0) {
			setIds([])
		}
		else {
			const newIds = order?.data?.data?.filter(e => e.state === ShipStatus.PENDING && e.ship.type !== ShipType.VNPOST).map(e => e.ship.code) || []
			console.log(newIds)
			setIds(newIds)
		}
	}

	const printOrders = async () => {
		const result = await shipService.printOrders(ids, query.shipType || "")
		if (result && result?.link)
		{
			const newtab = window.open(result.link, "_blank")
			if (newtab != null) {
				newtab.onload = () => {
					newtab.print()
				}
			}
		}
		else
		{
			const newtab = window.open(import.meta.env.VITE_API_HOST + result.replace("/", ""), "_blank")
			if (newtab != null) {
				newtab.onload = () => {
					newtab.print()
				}
			}
		}
	}

	const printOrder = async (order?: Order) => {
		const path = await shipService.printOrder(order?.ship.code || "", order?.ship.type || "" )
		if (path && path?.link)
		{
			const newtab = window.open(path.link, "_blank")
			if (newtab != null) {
				newtab.onload = () => {
					newtab.print()
				}
			}
		}
		else
		{
			const newtab = window.open(import.meta.env.VITE_API_HOST + path.replace("/", ""), "_blank")
			if (newtab != null) {
				newtab.onload = () => {
					newtab.print()
				}
			}
		}
	}
	const createOrderShip = (order?: Order) => {
		if (order) {
			dispatch(setCreateShipLoading(order._id))
			dispatch(OrderThunk.createOrderShip(order._id))
		}
	}
	return (
		<div id={"OrderManager"}>
			{
				configModal.create && (<OrderCreateModal open={configModal.create} onCancel={toggleModal("create")} />)
			}
			{
				configModal.update && (<ShipDetailModal open={configModal.update} onCancel={toggleModal("update")} />)
			}
			{
				configModal.timeline && (<ShipTimeLineModal open={configModal.timeline} onCancel={toggleModal("timeline")} />)
			}
			{
				configModal.updateInfor && (<UpdateShipInforOrderModal open={configModal.updateInfor} onCancel={toggleModal("updateInfor")} />)
			}



			<div className={"header-control"}>
				<div>

					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoReload />}
							onClick={e => setQuery({ ...query })}
						/>
					</Tooltip>

				</div>
				<div>
					<Space.Compact>
						<Select placeholder={"Đơn vị vận chuyển"} allowClear={true} style={{minWidth:"180px"}}
								onSelect={e=>setQuery({shipType:e,page:1})}
								onClear={()=>setQuery({shipType:undefined,page:1})}
								options={ShipHelper.toType()}/>
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
					<Tabs items={tabItemsShip(order?.data?.state)} centered={true}
						onChange={e => setQuery({ state: e, page: 1 })}
					/>
				</div>

				{
					query.state === ShipStatus.PENDING && query.shipType && (
						<div style={{ marginTop: "10px", marginBottom: "10px" }}>
							<Space.Compact>
								<Button type={"primary"} onClick={selectAll} >
									Chọn tất cả
								</Button>
								<Button type={"primary"} onClick={printOrders} >
									In đơn hàng
								</Button>
							</Space.Compact>
						</div>
					)
				}

				<div className={"table"}>
					<Table className={"table"} dataSource={order?.data?.data} rowKey={"_id"}
						scroll={{ x: 3500 }} pagination={false}
						onRow={(record: Order) => OnselectRow(record, selectOrder)}
						loading={order.loadings.getPage}
					>
						<Table.Column title={"Chọn"} align={"center"} width={70} render={(value, record: Order) => {
							if (record.ship.type == ShipType.VNPOST) {
								return ""
							}
							switch (record.state) {
								case ShipStatus.PENDING:
									return <Checkbox
										onChange={() => {
											console.log("record.ship.code", record.ship.code)
											if (ids.includes(record.ship.code)) {
												setIds(ids.filter(e => e !== record.ship.code))
											}
											else {
												ids.push(record.ship.code)
											}
										}}
										{...ids.includes(record.ship.code) && { checked: true }}
									/>
								default:
									return ""
							}

						}} />
						<Table.Column title={"STT"} align={"center"} width={70} render={NumberUtil.toIndex} />
						<Table.Column title={"Mã đơn hàng"} dataIndex={"code"} align={"center"} width={150} />
						<Table.Column title={"Mã vận đơn"} dataIndex={['ship', 'addOnInfo', 'itemCode']} align={"center"} width={150} />
						<Table.Column title={"Đơn vị vận chuyển"} dataIndex={['ship', 'type']} align={"center"} width={150} render={ShipHelper.catucatorShip} />
						<Table.Column title={"Tên khách hàng"} dataIndex={"ship"} width={200} render={(ship: Shipping) => ship?.to?.fullName} />
						<Table.Column title={"Số điện thoại"} dataIndex={"ship"} width={120} render={(ship: Shipping) => ship?.to?.phone} />
						<Table.Column title={"Địa chỉ"} dataIndex={"ship"} width={250} render={(ship: Shipping) => ship?.to?.address} />
						<Table.Column title={"Mã vùng"} dataIndex={"ship"} align={"center"} width={100} render={ShipHelper.toProviderShortName} />
						<Table.Column title={"Mã sản phẩm - Tên sản phẩm - Số lượng"} dataIndex={"details"} width={400} render={OrderHelper.ToProduct} />
						<Table.Column title={"Trạng thái"} dataIndex={"state"} align={"center"} width={150} render={ShipHelper.toTagStatus} />
						<Table.Column title={"Hàng trong kho"} dataIndex={"details"} align={"center"} width={350} render={OrderHelper.toStockStatus} />
						<Table.Column title={"Ghi chú"} dataIndex={['ship', 'note']} align={"center"} width={150} />
						<Table.Column title={"Tổng tiền"} width={150} align={"center"}
							render={(order: Order) => {
								const total = OrderHelper.getTotal(order.details)
								const shipFee = order.ship.fee || 0
								const discount = order.discount || 0
								const totalMoney = total + shipFee - discount
								return (
									NumberUtil.toNumberMoney(totalMoney)
								)
							}}
						/>
						<Table.Column title={"Cost(Tiền hàng)"} align={"center"} dataIndex={"details"} width={150}
							render={(details: Array<OrderDetail>) => {
								return (
									NumberUtil.toNumberMoney(OrderHelper.getTotal(details))
								)
							}}
						/>
						<Table.Column title={"Tiền Ship"} width={150} align={"center"}
							render={(order: Order) => {
								const shipFee = order.ship.fee || 0
								return (
									NumberUtil.toNumberMoney(shipFee)
								)
							}}
						/>
						<Table.Column title={"Ngày tạo"} width={150} dataIndex={"createdAt"} align={"center"}
							render={DateUtil.toCreateAt}
						/>
						<Table.Column title={"Ngày Chốt đơn"} width={150} dataIndex={"timeConfirm"} align={"center"}
							render={DateUtil.toCreateAt}
						/>
						<Table.Column title={"Phường xã"} dataIndex={"ship"} width={200} render={(ship: Shipping) => {
							return (
								<Tag color={MapUtil.gI().getProvince(ship.to?.province)?.color || "blue"}>
									<Typography.Text style={{ fontSize: "15px", color: "white" }}>
										{MapUtil.gI().getWard(ship.to?.ward)?.name}
									</Typography.Text>
								</Tag>
							)
						}} />
						<Table.Column title={"Quận huyện"} dataIndex={"ship"} width={200} render={(ship: Shipping) => {
							return (
								<Tag color={MapUtil.gI().getProvince(ship.to?.province)?.color || "blue"}>
									<Typography.Text style={{ fontSize: "15px", color: "white" }}>
										{MapUtil.gI().getDistrict(ship.to?.district)?.name}
									</Typography.Text>
								</Tag>
							)
						}} />
						<Table.Column title={"Tỉnh thành"} dataIndex={"ship"} width={200} render={(ship: Shipping) => {
							return (
								<Tag color={MapUtil.gI().getProvince(ship.to?.province)?.color || "blue"}>
									<Typography.Text style={{ fontSize: "15px", color: "white" }}>
										{MapUtil.gI().getProvince(ship.to?.province)?.name}
									</Typography.Text>
								</Tag>
							)
						}} />
						<Table.Column title={"Nguồn đơn"} dataIndex={"addOnInfo"} width={200} render={OrderHelper.SourceOrder} />
						<Table.Column title={"Nguồn hàng"} dataIndex={"details"} align={"center"} width={150} render={ProductHelper.toSrc} />
						<Table.Column title={"Hành động"} width={300} fixed={"right"} render={(orderx: Order) => {
							return (
								<Space.Compact>
									{
										orderx.state !== ShipStatus.NOT_CREATED && orderx.state !== ShipStatus.PENDING && (
											<Button type={"primary"}
												onClick={toggleModal("timeline")}
											>Lịch sử</Button>
										)
									}
									<Button type={"primary"}
										onClick={toggleModal("update")}
									>Chi tiết</Button>
									{
										orderx.state === ShipStatus.NOT_CREATED && (
											<Button type={"primary"}
												loading={order.loadings.createship[orderx._id] || false}
												onClick={() => createOrderShip(orderx)}
											>Tạo đơn</Button>
										)
									}
									{
										orderx.state == ShipStatus.PENDING &&  orderx.ship.type != ShipType.VNPOST && (
											<Button type={"primary"}
												onClick={() => printOrder(orderx)}
											>In đơn hàng</Button>
										)
									}


									{
										(orderx.state !== ShipStatus.NOT_CREATED && orderx.state === ShipStatus.PENDING) && (
											<Button type={"primary"} danger
												onClick={toggleModal("update")}
											>Hủy đơn</Button>
										)
									}
									{
										orderx.state === ShipStatus.NOT_CREATED && (
											<Button type={"primary"}
												onClick={toggleModal("updateInfor")}
											>Cập nhập</Button>
										)
									}
									
								</Space.Compact>
							)
						}} />
					</Table>
					<Pagination query={query} onChange={setQuery} page={order.data} />
				</div>
			</div>
		</div>)
}