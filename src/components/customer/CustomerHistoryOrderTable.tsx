import {Button, Popconfirm, Space, Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {useDispatch, useSelector} from "react-redux";
import {customerSelector} from "@store/customer/customer.slice.ts";
import {AppDispatch} from "@store/store.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {Order, OrderStatus, ShipStatus} from "@/@types/order/order.type.ts";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {MapUtil} from "@utils/map.util.ts";
import {useState} from "react";
import {FormatPrint} from "@/common/enums/formatPrint.enum";
import CustomerThunk from "@/common/store/customer/customer.thunk";

export default function CustomerHistoryOrderTable() {
	const customer = useSelector(customerSelector);
	const dispatch = useDispatch<AppDispatch>();
	const [modalVisible, setModalVisible] = useState(false);

	const coverData = () => {
		const preData = customer.select?.preOrders.map((order) => {
			const products = order.details.map((detail) => {
				return detail.productName;
			});
			const quantity = order.details.reduce((total, detail) => {
				return total + (detail.quantity || 0);
			}, 0);
			const price = order.details.reduce((total, detail) => {
				return total + (detail.quantity || 0) * (detail.price || 0);
			}, 0);
			return {
				...order,
				products: products.join("\n"),
				quantity: quantity,
				price: price,

				status: OrderHelper.Status(OrderStatus.CONFIRMED),
				state: ShipHelper.toTagStatus(ShipStatus.DELIVERED),
			};
		});
		const order = customer.select?.orders.map((order) => {
			const products = order.details.map((detail) => {
				return detail.product.name;
			});
			const quantity = order.details.reduce((total, detail) => {
				return total + (detail.quantity || 0);
			}, 0);
			const price = order.details.reduce((total, detail) => {
				return total + (detail.quantity || 0) * (detail.price || 0);
			}, 0);
			return {
				...order,
				products: products.join("\n"),
				quantity: quantity,
				price: price,
				status: OrderHelper.Status(order.status),
				state:
					order.status === OrderStatus.CONFIRMED
						? ShipHelper.toTagStatus(order?.state)
						: "",
				typeShip:
					order.status === OrderStatus.CONFIRMED
						? ShipHelper.toShipTypeName(order.ship?.type)
						: "",
				province: MapUtil.gI().getProvince(order.ship?.to?.province)
					?.name,
			};
		});
		return [...(preData || []), ...(order || [])];
	};

	return (
		<Table dataSource={coverData()} loading={customer.loadings.printOrder}>
			<Table.Column title={"STT"} render={NumberUtil.toIndex} />
			<Table.Column title={"Mã đơn hàng"} dataIndex={"code"} />
			<Table.Column title={"Sản phẩm"} dataIndex={"products"} />
			<Table.Column
				title={"SL"}
				dataIndex={"quantity"}
				align={"center"}
			/>
			<Table.Column
				title={"Tiền hàng"}
				dataIndex={"price"}
				align={"center"}
				render={NumberUtil.toNumberMoney}
			/>
			<Table.Column
				title={"Ngày mua"}
				dataIndex={"createdAt"}
				align={"center"}
				render={DateUtil.toCreateAt}
			/>
			<Table.Column
				title={"Trạng thái đơn"}
				dataIndex={"status"}
				align={"center"}
			/>
			<Table.Column
				title={"Trạng thái VC"}
				dataIndex={"state"}
				align={"center"}
			/>
			<Table.Column
				title={"Đơn vị VC"}
				dataIndex={"typeShip"}
				align={"center"}
			/>
			<Table.Column title={"Ghi chú"} dataIndex={"note"} />
			<Table.Column
				title={"Hành động"}
				width={150}
				align={"center"}
				fixed={"right"}
				render={(order: Order) => {
					return (
						<Space.Compact>
							{order.code !== undefined && (
								<Popconfirm
									title="Chọn kích thước giấy"
									onOpenChange={() => { }}
									okText="A4"
									cancelText='A5'
									onConfirm={() => {
										dispatch(CustomerThunk.printBill({ id: order._id, format: FormatPrint.A4 }))
									}}
									// onCancel={() => {
									// 	dispatch(CustomerThunk.printBill({ id: order._id, format: FormatPrint.A5 }))
									// }}
									cancelButtonProps={{ type: 'primary',style:{display:"none"} }}
								>
									<Button type="primary">Xuất hóa đơn</Button>
								</Popconfirm>
							)}
							{/*{order.code !== undefined && (*/}
							{/*	<Popconfirm*/}
							{/*		title="Chọn kích thước giấy"*/}
							{/*		onOpenChange={() => { }}*/}
							{/*		okText="A4"*/}
							{/*		cancelText='A5'*/}
							{/*		onConfirm={() => dispatch(CustomerThunk.printOrder({ id: order._id, format: FormatPrint.A4 })) }*/}
							{/*		onCancel={() => dispatch(CustomerThunk.printOrder({ id: order._id, format: FormatPrint.A5 }))}*/}
							{/*		cancelButtonProps={{ type: 'primary' }}*/}
							{/*	>*/}
							{/*		<Button type="primary">In hóa đơn</Button>*/}
							{/*	</Popconfirm>*/}
							{/*)}*/}
						</Space.Compact>
					);
				}}
			/>
		</Table>
	);
}
