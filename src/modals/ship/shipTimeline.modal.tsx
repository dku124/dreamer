import {Modal, ModalProps, Spin, Timeline as TimeLineComponet, Typography,} from "antd";
import {orderSelector} from "@store/order/order.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import OrderThunk from "@store/order/order.thunk.ts";
import {AppDispatch} from "@store/store.ts";
import {ShipHelper} from "@/common/helpers/ship.helper";
import dayjs from "dayjs";
import {ShipStatus} from "@/@types/order/order.type";

export function ShipTimeLineModal(props: ModalProps) {
	const order = useSelector(orderSelector);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (props.open && order.select) {
			dispatch(OrderThunk.getTimeline(order.select.ship._id));
		}
		console.log(order)
	}, [order.select, order.reloading]);

	const totalDayDelivery = () => {
		const dayCreate = order.select?.timeConfirm;
		const successfulDeliveries = order.timeline.filter((item) => item.status === ShipStatus.DELIVERED);

		if (successfulDeliveries.length > 0) {
			const deliveryDate = successfulDeliveries[0].createdAt;

			if (dayCreate && deliveryDate) {
				const dateCreate = new Date(dayCreate).getTime();
				const dateDelivery = new Date(deliveryDate).getTime();
				const timeDiff = dateDelivery - dateCreate;
				const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
				return totalDays;
			}
		}
		return 0;
	}

	const IsDelivered = () => {
		const successfulDeliveries = order.timeline.filter((item) => item.status === ShipStatus.DELIVERED);
		return successfulDeliveries.length > 0;
	}



	return (
		<div>
			<Modal
				{...props}
				cancelText={"Đóng"}
				okButtonProps={{ style: { display: "none" } }}
				title={"Lịch sử đơn hàng #" + order?.select?.code}
				width={720}
			>
				<Spin spinning={order.loadings.timeline}>
					<div style={{ padding: "15px", marginTop: "15px" }}>

						
							<div>

								<TimeLineComponet
									mode="left"
									// items={order?.timeline.map((item:any) => {
									// 	return {
									// 		color : ShipHelper.toShipStatus(item.status).color,
									// 		children: ShipHelper.toLabelTimeLine(order?.select?.ship?.type ||"",item),
									// 	}})
									// }
									items={[
										...[
											{
												color: "green",
												children: (
													<Typography.Text
														style={{ fontSize: "16px" }}
													>
														Ngày chốt đơn
													</Typography.Text>
												),
												label: (
													<Typography.Text
														style={{ fontSize: "16px" }}
													>
														{dayjs(order.select?.timeConfirm).format(
															"HH:mm DD/MM/YYYY",
														)}
													</Typography.Text>
												),
											},
										],
										...order?.timeline.map((item: any) => {
											return {
												color: ShipHelper.toShipStatus(
													item.status,
												).color,
												children: (
													<Typography.Text
														style={{ fontSize: "16px" }}
													>
														{ShipHelper.toLabelTimeLine(
															order?.select?.ship?.type ||
															"",
															item,
														)}
													</Typography.Text>
												),
												label: (
													<Typography.Text
														style={{ fontSize: "16px" }}
													>
														{dayjs(item.createdAt).format(
															"HH:mm DD/MM/YYYY",
														)}
													</Typography.Text>
												),
											};
										})
									]}
								/>
								{IsDelivered() ? (<p> Số ngày giao hàng thành công : {totalDayDelivery()} ngày</p>) : null}
							</div>
					</div>
				</Spin>
			</Modal>
		</div>
	);
}
