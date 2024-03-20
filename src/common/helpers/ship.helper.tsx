import {Shipping, ShipSession, ShipType} from "@/@types/order/ship.type.ts";
import {MapUtil} from "@utils/map.util.ts";
import {ShipStatus} from "@/@types/order/order.type.ts";
import {OrderDetail} from "@/@types/order/detail.type.ts";
import {Timeline} from "@/@types/timeline.type";
import {GhnStatus} from "../enums/ghn.status.enum";
import {Tag} from "antd";
import {MapLevel1s} from "@/@types/map/map.type.ts";

export class ShipHelper {
	static toType() {
		const labels: Record<string, string> = {
			[ShipType.GHN]: "GHN",
			[ShipType.GHTK]: "GHTK",
			[ShipType.VIETTEL_POST]: "Viettel Post",
			[ShipType.VNPOST]: "VNPost",
			[ShipType.UNKNOWN]: "Khác",
		};
		return Object.keys(labels).map((key) => ({
			label: labels[key],
			value: key,
		}));
	}

	static catucatorShip(type: ShipType) {
		switch (type) {
			case ShipType.GHN:
				return "GHN";
			case ShipType.GHTK:
				return "GHTK";
			case ShipType.VIETTEL_POST:
				return "Viettel Post";
			case ShipType.VNPOST:
				return "VNPost";
			default:
				return "Khác";
		}
	}

	static toProviderShortName(ship: Shipping) {
		if (!ship.to?.province) {
			return "";
		}
		return MapUtil.gI().getProvince(ship.to?.province)?.short_name;
	}

	static toShipTypeName(type: ShipType | undefined) {
		switch (type) {
			case ShipType.GHTK:
				return "Giao hàng tiết kiệm";
			case ShipType.GHN:
				return "Giao hàng nhanh";
			case ShipType.VIETTEL_POST:
				return "Viettel Post";
			case ShipType.VNPOST:
				return "VNPost";
			default:
				return "Khác";
		}
	}

	static toShipSession(session: ShipSession | undefined) {
		switch (session) {
			case ShipSession.MORNING:
				return "Sáng";
			case ShipSession.AFTERNOON:
				return "Chiều";
			case ShipSession.EVENING:
				return "Tối";
			default:
				return "Khác";
		}
	}
	static totalProductPrice(details: Array<OrderDetail>) {
		return details.reduce((total: number, detail: OrderDetail) => {
			return (
				total +
				(detail.price + detail.color.size.price) * detail.quantity
			);
		}, 0);
	}

	static toLabelVnPostStatus(status: number): string {
		switch (Number(status)) {
			case 0:
				return "Lưu nháp";
			case 1:
				return "Đã tạo";
			case 2:
				return "Chuyển tin cho bưu tá";
			case 3:
				return "Đang xử lý";
			case 4:
				return "Đang lấy hàng";
			case 5:
				return "Lấy hàng không thành công";
			case 6:
				return "Lấy hàng thành công";
			case 7:
				return "Bưu cục đã nhận hàng";
			case 8:
				return "Lấy hàng thất bại";
			case 9:
				return "Hủy thu gom";
			case 10:
				return "Đang vận chuyển";
			case 11:
				return "Đã đến Bưu cục phát";
			case 12:
				return "Đang giao hàng";
			case 13:
				return "Chuyển tiếp";
			case 14:
				return "Đã giao hàng";
			case 15:
				return "Giao hàng không thành công";
			case 16:
				return "Chờ để chuyển hoàn";
			case 17:
				return "Đã duyệt hoàn";
			case 18:
				return "Bắt đầu chuyển hoàn";
			case 19:
				return "Hoàn thành công";
			case 20:
				return "Đã trả hàng 1 phần";
			case 21:
				return "Đã trả tiền COD";
			case 22:
				return "Hủy giao hàng";
			case 101:
				return "EMA - Đã chấp nhận gửi";
			case 102:
				return "EMB - Đến Trung tâm khai thác quốc tế nước gửi";
			case 103:
				return "EMC - Đã rời khỏi Trung tâm khai thác quốc tế nước gửi";
			case 104:
				return "EMD - Đã đến Trung tâm khai thác quốc tế nước nhận";
			case 105:
				return "EME - Đang lưu giữ tại hải quan nước nhận";
			case 106:
				return "EMF - Ra khỏi Trung tâm khai thác quốc tế của nước nhận";
			case 107:
				return "EMG - Đã đến Bưu cục phát";
			case 108:
				return "EMH - Phát chưa thành công";
			case 109:
				return "EMI - Đã phát thành công";
			case 110:
				return "EMJ - Đến Trung tâm khai thác quốc tế quá cảnh";
			case 111:
				return "EMK - Khởi hành từ Trung tâm khai thác quốc tế quá cảnh";
			default:
				return "Khác";
		}
	}

	static toLabelGHNStatus(status: string) :string{
		switch (status) {
			case GhnStatus.ready_to_pick:
				return "Mới tạo đơn hàng";	
			case GhnStatus.picking:
				return "Nhân viên đang lấy hàng";
			case GhnStatus.cancel:
				return "Đã hủy đơn hàng";
			case GhnStatus.money_collect_picking:
				return "Đơn hàng đang được lấy đi thu tiền";
			case GhnStatus.picked:
				return "Nhân viên đã lấy hàng";
			case GhnStatus.storing:
				return " Đơn hàng đang được lưu kho";
			case GhnStatus.transporting:
				return "Đơn hàng đang được vận chuyển";
			case GhnStatus.sorting:
				return "Đơn hàng đang được sắp xếp";
			case GhnStatus.delivering:
				return "Đơn hàng đang được giao";
			case GhnStatus.money_collect_delivering:
				return "Nhân viên đang thu tiền người nhận";
			case GhnStatus.delivered:
				return "Đơn hàng đã được giao";
			case GhnStatus.delivery_failed:
				return "Giao hàng không thành công";
			case GhnStatus.waiting_to_return:
				return "Đang chờ hoàn hàng";
			case GhnStatus.return:
				return "ơn hàng đã được hoàn";
			case GhnStatus.return_transporting:
				return " Đang luân chuyển hàng trả";
			case GhnStatus.return_sorting:
				return "Đang phân loại hàng trả";
			case GhnStatus.returning:
				return "Nhân viên đang đi trả hàng";
			case GhnStatus.return_fail:
				return "Trả hàng không thành công";
			case GhnStatus.returned:
				return "Đã trả hàng thành công";
			case GhnStatus.exception:
				return "Đơn hàng bị ngoại lệ";
			case GhnStatus.damage:
				return "Đơn hàng bị hư hỏng";
			case GhnStatus.lost:
				return "Đơn hàng bị mất";
			default:
				return "Khác";
		}

	}

	static toLabelGHTKStatus(status: number): string {
		switch (Number(status)) {
			case -1:
				return "Đã hủy";
			case 1:
				return "Chưa tiếp nhận";
			case 2:
				return "Đã tiếp nhận";
			case 3:
				return "Đã lấy hàng/Đã nhập kho";
			case 4:
				return "Đã điều phối giao hàng/Đang giao hàng";
			case 5:
				return "Đã giao hàng/Chưa đối soát";
			case 6:
				return "Đã đối soát";
			case 7:
				return "Không lấy được hàng";
			case 8:
				return "Hoãn lấy hàng";
			case 9:
				return "Không giao được hàng";
			case 10:
				return "Delay giao hàng";
			case 11:
				return "Đã đối soát công nợ trả hàng";
			case 12:
				return "Đã điều phối lấy hàng/Đang lấy hàng";
			case 13:
				return "Đơn hàng bồi hoàn";
			case 20:
				return "Đang trả hàng (COD cầm hàng đi trả)";
			case 21:
				return "Đã trả hàng (COD đã trả xong hàng)";
			case 123:
				return "Shipper báo đã lấy hàng";
			case 127:
				return "Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng";
			case 128:
				return "Shipper báo delay lấy hàng";
			case 45:
				return "Shipper báo đã giao hàng";
			case 49:
				return "Shipper báo không giao được hàng";
			case 410:
				return "Shipper báo delay giao hàng";
			default:
				return "Khác";
		}
	}
	

	static toLabelTimeLine(type: string, timeLine: Timeline) {
		switch (type) {
			case ShipType.VNPOST:
				return ShipHelper.toLabelVnPostStatus(timeLine.data.status);
			case ShipType.GHN:
				return ShipHelper.toLabelGHNStatus(timeLine.data.Status.toString());
			case ShipType.GHTK:
				return ShipHelper.toLabelGHTKStatus(timeLine.data.status_id);
		}
		return timeLine.data.status;
	};
	
	static toTagStatus(status: string) {
		const data = ShipHelper.toShipStatus(status);
		return <Tag style={{minWidth:"105px"}} color={data.color}>{data.label}</Tag>;
	}
	
	
	static toLabelStatus() {
		return [...Object.keys(ShipStatus)].map((key) => {
			return {
				label: ShipHelper.toTagStatus(key),
				value: key,
			};
		});
	}
	
	
	static toShipStatus(status: string) {
		switch (status) {
			case ShipStatus.NOT_CREATED:
				return {
					label: "Chưa tạo đơn",
					color: "#0000FF",
				};
			case ShipStatus.PENDING:
				return {
					label: "Chờ lấy hàng",
					color: "#CCCC00",
				};
			case ShipStatus.CONFIRMED:
				return {
					label: "Đã lấy hàng",
					color: "#00FF00",
				};
			case ShipStatus.DELIVERING:
				return {
					label: "Đang giao hàng",
					color: "#FFA500",
				};
			case ShipStatus.DELIVERING_FAIL:
				return {
					label: "Giao hàng thất bại",
					color: "#964B00",
				};
			case ShipStatus.DELIVERED:
				return {
					label: "Đã giao hàng",
					color: "#00008B",
				};
			case ShipStatus.RETURN:
				return {
					label: "Đang hoàn hàng",
					color: "#800080",
				};
			case ShipStatus.RETURNED:
				return {
					label: "Đã hoàn hàng",
					color: "#008000",
				};
			case ShipStatus.CANCELED:
				return {
					label: "Đã hủy",
					color: "#FF0000",
				};
			default:
				return {
					label: "Tất cả",
					color: "#3498db",
				};
		}
	}
	
	static toProvider(map:MapLevel1s) {
		return {
			label:<Tag color={map.color}>{map.name}</Tag>,
			value:map.level1_id,
			raw:map.name
		}
	}
	
	static toProviderList() {
		const listLV1 = MapUtil.gI().getMapLV1();
		const listProvider = [];
		for (let key of listLV1) {
			const [id,data] = key;
			listProvider.push(ShipHelper.toProvider(data));
			
		}
		return listProvider;
	}
}
