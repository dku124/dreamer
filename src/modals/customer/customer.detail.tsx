import {Modal, ModalProps, Table,} from "antd";
import {Customer} from "../../@types/repo/customer.type";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import CustomerThunk from "@/common/store/customer/customer.thunk";
import {AppDispatch} from "@/common/store/store";
import {customerSelector,} from "@/common/store/customer/customer.slice";
import {CustomerHelper} from "@/common/helpers/customer.helper";
import {NumberUtil} from "@/common/utils/number.util";
import {Order} from "@/@types/order/order.type";


export default function CustomerDetailsModal(props: ModalProps) {
	const customer = useSelector(customerSelector);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (customer?.select?._id) {
			dispatch(CustomerThunk.getDetail(customer?.select as Customer));
		}
	}, [customer.select]);

	const coverData = () => {
		const data =  customer?.detail?.map((order: Order) => {
			return {
				...order,
			};
		});
		const data2 = customer?.select?.preOrders?.map((order) => {
			return {
				ship:{
					to:{
						fullName: customer?.select?.fullName,
						phone: customer?.select?.phone,
						address: customer?.select?.address
					}
				},
				preOrder: true,
				detailsPre: order.details.map((detail) => {
					return {
						productName: detail.productName,
						quantity: detail.quantity,
						price: detail.price,
						totalMoney: detail.price * detail.quantity,
					};
				}),
				details: [],
			};
		});
		
		// @ts-ignore
		return [...data, ...data2];
	};

	return (
		<div id="ProductUnitCreateModal">
			<Modal
				{...props}
				width={1500}
				title={"Chi tiết khách hàng"}
				cancelText={"Đóng"}
				okButtonProps={{ style: { display: "none" } }}
			>
				<div className={"body-control"}>
					<Table
						pagination={false}
						rowKey={"_id"}
						loading={customer?.detail===undefined}
						dataSource={customer?.detail!==undefined ? coverData(): []}
					>
						<Table.Column
							title={"STT"}
							align="center"
							render={NumberUtil.toIndex}
						/>
						<Table.Column
							title={"Tên khách hàng"}
							width={250}
							dataIndex={['ship','to','fullName']}
						/>
						<Table.Column
							title={"Số điện thoại"}
							width={150}
							align="center"
							dataIndex={['ship','to','phone']}
						/>
						<Table.Column title={"Địa chỉ"} dataIndex={['ship','to','address']} />
						<Table.Column
							title={"Sản phẩm mua"}
							render={CustomerHelper.product}
						/>
						<Table.Column
							title={"SL"}
							align="center"
							render={CustomerHelper.qualityOrder}
						/>
						<Table.Column
							title={"Tiền hàng"}
							align="center"
							width={150}
							render={CustomerHelper.totalMoneyOrder}
						/>
						<Table.Column
							title={"Ngày mua"}
							align="center"
							render={CustomerHelper.dayBuy}
						/>
					</Table>
				</div>
			</Modal>
		</div>
	);
}
