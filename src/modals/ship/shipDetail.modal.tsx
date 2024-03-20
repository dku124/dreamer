import {Button, Descriptions, Modal, ModalProps, Space, Spin} from "antd";
import {orderSelector, setCancelShipLoading, setCreateShipLoading,} from "@store/order/order.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import OrderThunk from "@store/order/order.thunk.ts";
import {AppDispatch} from "@store/store.ts";
import {MapUtil} from "@utils/map.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {NumberUtil} from "@utils/number.util.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {Order, ShipStatus} from "@/@types/order/order.type.ts";
import shipService from "@/services/order/ship.service.ts";
import {OrderReturnModal} from "@/modals/order/OrderReturn.modal.tsx";
import {ShipAsyncModal} from "./shipAsync.modal";

export function ShipDetailModal(props: ModalProps) {
	const order = useSelector(orderSelector);
	const dispatch = useDispatch<AppDispatch>();
	const [modal, setModal] = useState<Record<string, boolean>>({
		returnModal: false,
		shipAsyncModal: false,
	});

	useEffect(() => {
		if ((props.open && order.select) || !modal.returnModal) {
			dispatch(OrderThunk.getDetail(order?.select as any));
		}
	}, [order.select, order.reloading, modal.returnModal]);

	const createOrderShip = (order?: Order) => {
		if (order) {
			dispatch(setCreateShipLoading(order._id));
			dispatch(OrderThunk.createOrderShip(order._id));
		}
	};
	const returnOrderShip = (order?: Order) => {
		if (order) {
			dispatch(OrderThunk.ReturnOrderToSale(order._id));
		}
		if (props.onCancel) {
			props.onCancel(undefined as any);
		}
	};

	const cancelOrderShip = (order?: Order) => {
		if (order) {
			dispatch(setCancelShipLoading(order._id));
			dispatch(OrderThunk.cancelOrderShip(order._id));
		}
	};

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
	};

	const toggleModal = (modals: string) => {
		return () => {
			setModal({ ...modal, [modals]: !modal[modals] });
		};
	};

	return (
		<div>
			{modal.returnModal && (
				<OrderReturnModal
					open={modal.returnModal}
					onCancel={toggleModal("returnModal")}
				/>
			)}
			{
				modal.shipAsyncModal && (<ShipAsyncModal open={modal.shipAsyncModal} onCancel={toggleModal("shipAsyncModal")} />)
			}

			<Modal
				{...props}
				width={1080}
				cancelText={"Đóng"}
				okButtonProps={{ style: { display: "none" } }}
			>
				<Spin spinning={order.detail == undefined}>
					<Descriptions
						size={"small"}
						layout={"vertical"}
						title={"Thông tin đơn hàng #" + order?.select?.code}
						column={24}
					>
						<Descriptions.Item label="Tên người nhận" span={8}>
							{order.detail?.ship?.to?.fullName}
						</Descriptions.Item>
						<Descriptions.Item label="Số điện thoại" span={8}>
							{order.detail?.ship?.to?.phone}
						</Descriptions.Item>
						<Descriptions.Item
							label="Ghi chú ( Vận chuyển )"
							span={8}
						>
							{order.detail?.ship?.note}
						</Descriptions.Item>
						<Descriptions.Item label="Địa chỉ" span={24}>
							{
								MapUtil.gI().getProvince(
									order.detail?.ship?.to?.province,
								)?.name
							}{" "}
							-{" "}
							{
								MapUtil.gI().getDistrict(
									order.detail?.ship?.to?.district,
								)?.name
							}{" "}
							-{" "}
							{
								MapUtil.gI().getWard(
									order.detail?.ship?.to?.ward,
								)?.name
							}{" "}
							- {order.detail?.ship?.to?.address}
						</Descriptions.Item>
						<Descriptions.Item label="Đơn vị vận chuyển" span={8}>
							{ShipHelper.toShipTypeName(
								order.detail?.ship?.type,
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Ca lấy hàng" span={4}>
							{ShipHelper.toShipSession(
								order.detail?.ship?.pickSession,
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Ca giao hàng" span={4}>
							{ShipHelper.toShipSession(
								order.detail?.ship?.shiftSession,
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Miễn phí ship" span={4}>
							{order.detail?.ship?.freeShip ? "Có" : "Không"}
						</Descriptions.Item>
						<Descriptions.Item label="Ngày lấy hàng" span={4}>
							{DateUtil.format(
								order.detail?.ship?.pickUpDate,
								DateUtil.dateFormat,
							)}
						</Descriptions.Item>

						<Descriptions.Item label="Sản phẩm" span={12}>
							{OrderHelper.ToProduct(
								order?.detail?.details || [],
							)}
						</Descriptions.Item>

						<Descriptions.Item label="Chứ năng" span={12}>
							<Space.Compact>
								{order?.detail?.state ===
									ShipStatus.PENDING && (
									<Button
										type={"primary"}
										onClick={() =>
											printOrder(
												order?.detail || undefined,
											)
										}
									>
										In đơn hàng
									</Button>
								)}
								{order?.detail?.state ===
									ShipStatus.NOT_CREATED && (
									<Button
										type={"primary"}
										onClick={() =>
											createOrderShip(
												order?.detail || undefined,
											)
										}
										loading={
											order.loadings.createship[
												order.detail._id
											] || false
										}
									>
										Tạo đơn
									</Button>
								)}
								{order?.detail?.state ===
									ShipStatus.PENDING && (
									<Button
										type={"primary"}
										loading={
											order.loadings.cancelship[
												order.detail._id
											] || false
										}
										onClick={() =>
											cancelOrderShip(
												order?.detail || undefined,
											)
										}
										danger
									>
										Hủy đơn
									</Button>
								)}
								{order?.detail?.state ===
									ShipStatus.NOT_CREATED && (
									<Button
										danger
										type={"primary"}
										onClick={() =>
											returnOrderShip(
												order?.detail || undefined,
											)
										}
									>
										Hoàn đơn về sale
									</Button>
								)}
								{order?.detail?.state === ShipStatus.RETURN && (
									<Button
										type={"primary"}
										onClick={() => {
											setModal({
												...modal,
												returnModal: true,
											});
										}}
									>
										Xác nhận hoàn hàng
									</Button>
								)}
								{order?.detail?.state ===
									ShipStatus.NOT_CREATED && (
									<Button
										type={"primary"}
										onClick={() => {
											setModal({
												...modal,
												shipAsyncModal: true,
											});
										}}
									>
										Đồng bộ đơn
									</Button>
								)}
							</Space.Compact>
						</Descriptions.Item>
						<Descriptions.Item label="Tiền hàng" span={4}>
							{NumberUtil.toNumberMoney(
								OrderHelper.getTotal(
									order?.detail?.details || [],
								),
							)}{" "}
							đ
						</Descriptions.Item>
						<Descriptions.Item label="Tiền ship" span={4}>
							{NumberUtil.toNumberMoney(
								order?.detail?.ship?.fee || 0,
							)}{" "}
							đ
						</Descriptions.Item>
						<Descriptions.Item label="Giảm giá" span={4}>
							{NumberUtil.toNumberMoney(
								order?.detail?.discount || 0,
							)}{" "}
							đ
						</Descriptions.Item>
						<Descriptions.Item label="Tổng tiền" span={4}>
							{NumberUtil.toNumberMoney(
								OrderHelper.getTotal(
									order?.detail?.details || [],
								) +
									(order?.detail?.ship?.fee || 0) -
									(order?.detail?.discount || 0),
							)}{" "}
							đ
						</Descriptions.Item>
					</Descriptions>
				</Spin>
			</Modal>
		</div>
	);
}
