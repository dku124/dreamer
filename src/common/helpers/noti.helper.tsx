import {EventNoti, Noti} from "@/@types/noti/noti.type.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {
	FcAddColumn,
	FcAnswers,
	FcCancel,
	FcCheckmark,
	FcDeleteColumn,
	FcDownLeft,
	FcHighPriority,
	FcPaid,
	FcShipped,
	FcUpload,
} from "react-icons/fc";
import {SkuCreateModalNoti} from "@/modals/noti/create/SkuCreate.modal";
import {CateCreateModalNoti} from "@/modals/noti/create/category.modal";
import {ProductCreateModalNoti} from "@/modals/noti/create/product.modal";
import {OrderCreateModalNoti} from "@/modals/noti/create/order.modal";
import {SupplierCreateModalNoti} from "@/modals/noti/create/supplier.modal";
import {ProductUnitCreateModalNoti} from "@/modals/noti/create/product.unit.modal";
import {SkuUpdateModalNoti} from "@/modals/noti/update/sku.update.modal";
import {CategoryUpdateModalNoti} from "@/modals/noti/update/category.update.modal";
import {ProductUnitUpdateModalNoti} from "@/modals/noti/update/product.unit.update.modal";
import {SupplierUpdateModalNoti} from "@/modals/noti/update/supplier.update.modal";
import {ProductUpdateModalNoti} from "@/modals/noti/update/product.update.modal";
import {OrderComfirmModalNoti} from "@/modals/noti/create/order.comfirm.modal";
import {ProductSoudOutModalNoti} from "@/modals/noti/warnning/product.warnning.modal";
import {TbTruckReturn} from "react-icons/tb";
import {OrderReturnModal} from "@/modals/noti/warnning/order.return.modal.tsx";
import {OrderDeliveryFailedModal} from "@/modals/noti/warnning/order.deliveryFailed";


export class NotiHelper {
	static toMessage(noti: Noti) {
		return {
			id: noti._id,
			avatar: NotiHelper.toIcon(noti),
			title: NotiHelper.toTitle(noti),
			description: NotiHelper.toDescription(noti),
			datetime: DateUtil.format(noti.createdAt, "DD/MM/YYYY HH:mm"),
			type: noti.role,
			entity: noti,
		};
	}

	// hàm viết hoa chữ cái đầu tiên
	static capitalizeFirstLetter(string: string) {
		const result = string.charAt(0).toUpperCase() + string.slice(1);
		return result.toString();
	}

	static toList(notis: Noti[]) {
		return notis.map(NotiHelper.toMessage);
	}

	static toIcon(noti: Noti) {
		switch (noti.action) {
			case EventNoti.SKU_CREATE:
				return <FcAddColumn size={25} />;
			case EventNoti.SKU_UPDATE:
				return <FcAnswers size={30} />;
			case EventNoti.SKU_DELETE:
				return <FcDeleteColumn size={25} />;
			case EventNoti.PRODUCT_CREATE:
				return <FcAddColumn size={25} />;
			case EventNoti.PRODUCT_UPDATE:
				return <FcAnswers size={25} />;
			case EventNoti.PRODUCT_DELETE:
				return <FcDeleteColumn size={25} />;
			case EventNoti.ORDER_NEW:
				return <FcPaid size={25} />;
			case EventNoti.ORDER_RETURN:
				return <FcShipped size={25} />;
			case EventNoti.ORDER_CANCEL:
				return <FcCancel size={25} />;
			case EventNoti.ORDER_UPDATE:
				return <FcAnswers size={25} />;
			case EventNoti.PRODUCT_SOLD_OUT:
				return <FcHighPriority size={25} />;
			case EventNoti.PRODUCT_IMPORT:
				return <FcUpload size={25} />;
			case EventNoti.CATEGORY_CREATE:
				return <FcAddColumn size={25} />;
			case EventNoti.CATEGORY_UPDATE:
				return <FcAnswers size={30} />;
			case EventNoti.CATEGORY_DELETE:
				return <FcDeleteColumn size={25} />;
			case EventNoti.UNIT_CREATE:
				return <FcAddColumn size={25} />;
			case EventNoti.UNIT_UPDATE:
				return <FcAnswers size={30} />;
			case EventNoti.UNIT_DELETE:
				return <FcDeleteColumn size={25} />;
			case EventNoti.SUPPLIER_CREATE:
				return <FcAddColumn size={25} />;
			case EventNoti.SUPPLIER_UPDATE:
				return <FcAnswers size={30} />;
			case EventNoti.SUPPLIER_DELETE:
				return <FcDeleteColumn size={25} />;
			case EventNoti.ORDER_CONFIRM:
				return <FcCheckmark size={25} />;
			case EventNoti.ORDER_REFUND_TO_SALE:
				return <FcDownLeft size={25} />;
			case EventNoti.ORDER_RETURN_CONFIRM:
				return <TbTruckReturn size={25} />;
			case EventNoti.ORDER_DELIVERY_FAILED:
				return <FcCancel size={25} />;
			case EventNoti.USER_UPDATE:
				return <FcAnswers size={30} />;
			case EventNoti.USER_RESET_PASSWORD:
				return <FcAnswers size={30} />;
		}
	}

	static toWidth(noti: Noti) {
		switch (noti.action) {
			case EventNoti.SKU_UPDATE:
				return 1024;
			case EventNoti.PRODUCT_UPDATE:
				return 1024;
			case EventNoti.ORDER_UPDATE:
				return 1024;
			case EventNoti.CATEGORY_UPDATE:
				return 1024;
			case EventNoti.UNIT_UPDATE:
				return 1024;
			case EventNoti.SUPPLIER_UPDATE:
				return 1024;

			default:
				return 720;
		}
	}

	static toTitle(noti: Noti) {
		switch (noti?.action) {
			case EventNoti.SKU_CREATE:
				return "Tạo SKU";
			case EventNoti.SKU_UPDATE:
				return "Cập nhật SKU";
			case EventNoti.SKU_DELETE:
				return "Xóa SKU";
			case EventNoti.PRODUCT_CREATE:
				return "Tạo sản phẩm";
			case EventNoti.PRODUCT_UPDATE:
				return "Cập nhật sản phẩm";
			case EventNoti.PRODUCT_DELETE:
				return "Xóa sản phẩm";
			case EventNoti.ORDER_NEW:
				return "Đơn hàng mới";
			case EventNoti.ORDER_RETURN:
				return "Đơn hàng trả hàng";
			case EventNoti.ORDER_CONFIRM:
				return "Đơn hàng xác nhận";
			case EventNoti.ORDER_CANCEL:
				return "Đơn hàng hủy";
			case EventNoti.ORDER_UPDATE:
				return "Cập nhật đơn hàng";
			case EventNoti.PRODUCT_SOLD_OUT:
				return "Sản phẩm hết hàng";
			case EventNoti.PRODUCT_IMPORT:
				return "Nhập kho";
			case EventNoti.CATEGORY_CREATE:
				return "Tạo danh mục mới";
			case EventNoti.CATEGORY_UPDATE:
				return "Cập nhật thông danh mục";
			case EventNoti.CATEGORY_DELETE:
				return "Xóa danh mục";
			case EventNoti.UNIT_CREATE:
				return "Tạo đơn vị mới";
			case EventNoti.UNIT_UPDATE:
				return "Cập nhật thông tin đơn vị";
			case EventNoti.UNIT_DELETE:
				return "Xóa đơn vị";
			case EventNoti.SUPPLIER_CREATE:
				return "Tạo nhà cung cấp mới";
			case EventNoti.SUPPLIER_UPDATE:
				return "Cập nhật thông tin nhà cung cấp";
			case EventNoti.SUPPLIER_DELETE:
				return "Xóa nhà cung cấp";
			case EventNoti.ORDER_REFUND_TO_SALE:
				return "Hoàn đơn về sale";
			case EventNoti.ORDER_RETURN_CONFIRM:
				return "Đơn hoàn hàng";
			case EventNoti.ORDER_DELIVERY_FAILED:
				return "Đơn giao hàng thất bại";
			case EventNoti.USER_UPDATE:
				return "Cập nhập thông tin User";
			case EventNoti.USER_RESET_PASSWORD:
				return " Cập nhập password"
		}
	}

	static toDescription(noti: Noti) {
		let e;
		let user;
		if (noti.userName) {
			e = <b>{noti.fullName || noti.userName}</b>;
		}
		if (noti.action == EventNoti.USER_UPDATE) {
			user = <b>{noti.data[0]?.username}</b>
		}
		switch (noti.action) {
			case EventNoti.SKU_CREATE:
				return <h3>{e} đã tạo SKU bấm vào để xem chi tiết</h3>;
			case EventNoti.SKU_UPDATE:
				return <h3> {e} đã cập nhật SKU bấm vào để xem chi tiết</h3>;
			case EventNoti.SKU_DELETE:
				return <h3> {e} đã xóa SKU bấm vào để xem chi tiết</h3>;
			case EventNoti.PRODUCT_CREATE:
				return <h3> {e} đã tạo sản phẩm bấm vào để xem chi tiết</h3>;
			case EventNoti.PRODUCT_UPDATE:
				return (
					<h3> {e} đã cập nhật sản phẩm bấm vào để xem chi tiết</h3>
				);
			case EventNoti.PRODUCT_DELETE:
				return <h3> {e} đã xóa sản phẩm bấm vào để xem chi tiết</h3>;
			case EventNoti.ORDER_NEW:
				const data = noti.data[0] as { orderCount: number };
				return <h3>Bạn vừa có {data?.orderCount} đơn hàng mới</h3>;
			case EventNoti.ORDER_RETURN:
				return (
					<h3>
						Đã có 1 sản phẩm bị trả hàng bấm vào để xem chi tiết
					</h3>
				);
			case EventNoti.ORDER_CANCEL:
				return <h3>{e} đã hủy đơn hàng bấm vào để xem chi tiết</h3>;
			case EventNoti.ORDER_CONFIRM:
				return (
					<h3>{e} đã xác nhận đơn hàng bấm vào để xem chi tiết</h3>
				);
			case EventNoti.ORDER_UPDATE:
				return (
					<h3>{e} đã cập nhật đơn hàng bấm vào để xem chi tiết</h3>
				);
			case EventNoti.PRODUCT_SOLD_OUT:
				return (
					<h3>Có 1 sản phẩm đã hết hàng bấm vào để xem chi tiết</h3>
				);
			case EventNoti.PRODUCT_IMPORT:
				return <h3>{e} đã nhập kho bấm vào để xem chi tiết</h3>;
			case EventNoti.CATEGORY_CREATE:
				return <h3>{e} đã tạo danh mục bấm vào để xem chi tiết</h3>;
			case EventNoti.CATEGORY_UPDATE:
				return (
					<h3>{e} đã cập nhật danh mục bấm vào để xem chi tiết</h3>
				);
			case EventNoti.CATEGORY_DELETE:
				return <h3>{e} đã xóa danh mục bấm vào để xem chi tiết</h3>;
			case EventNoti.UNIT_CREATE:
				return <h3>{e} đã tạo đơn vị bấm vào để xem chi tiết</h3>;
			case EventNoti.UNIT_UPDATE:
				return <h3>{e} đã cập nhật đơn vị bấm vào để xem chi tiết</h3>;
			case EventNoti.UNIT_DELETE:
				return <h3>{e} đã xóa đơn vị bấm vào để xem chi tiết</h3>;
			case EventNoti.SUPPLIER_CREATE:
				return <h3>{e} đã tạo nhà cung cấp bấm vào để xem chi tiết</h3>;
			case EventNoti.SUPPLIER_UPDATE:
				return (
					<h3>
						{e} đã cập nhật nhà cung cấp bấm vào để xem chi tiết
					</h3>
				);
			case EventNoti.SUPPLIER_DELETE:
				return <h3>{e} đã xóa nhà cung cấp bấm vào để xem chi tiết</h3>;
			case EventNoti.ORDER_REFUND_TO_SALE:
				const data1 = (noti.data[0] as { code?: string })
					?.code as string;
				return (
					<h3>
						Đơn hàng {data1} đã hoàn về bạn bấm vào để xem chi tiết
					</h3>
				);
			case EventNoti.ORDER_RETURN_CONFIRM:
				const data2 = (noti.data[0] as { code?: string })
					?.code as string;
				return (
					<h3>
						Đơn hàng {data2} đã bị trả hàng bạn bấm vào để xem chi
						tiết
					</h3>
				);
			case EventNoti.ORDER_DELIVERY_FAILED:
				const data3 = (noti.data[0] as { code?: string })
					?.code as string;
				return (
					<h3>
						Đơn hàng {data3} đã giao hàng thất bại bạn bấm vào để
						xem chi tiết
					</h3>
				);
			case EventNoti.USER_UPDATE:
				return <h3>{e} đã cập nhật User {user}</h3>
			case EventNoti.USER_RESET_PASSWORD:
				return <h3>{e} đã cập nhật mật khẩu mới User {user}</h3>
		}
	}

	static toModal(noti: Noti) {
		switch (noti.action) {
			case EventNoti.SKU_CREATE:
				return <SkuCreateModalNoti />;
			case EventNoti.CATEGORY_CREATE:
				return <CateCreateModalNoti />;
			case EventNoti.PRODUCT_CREATE:
				return <ProductCreateModalNoti />;
			case EventNoti.SUPPLIER_CREATE:
				return <SupplierCreateModalNoti />;
			case EventNoti.UNIT_CREATE:
				return <ProductUnitCreateModalNoti />;
			case EventNoti.SKU_DELETE:
				return <SkuCreateModalNoti />;
			case EventNoti.CATEGORY_DELETE:
				return <CateCreateModalNoti />;
			case EventNoti.PRODUCT_DELETE:
				return <ProductCreateModalNoti />;
			case EventNoti.ORDER_CANCEL:
				return <OrderCreateModalNoti />;
			case EventNoti.SUPPLIER_DELETE:
				return <SupplierCreateModalNoti />;
			case EventNoti.UNIT_DELETE:
				return <ProductUnitCreateModalNoti />;
			case EventNoti.SKU_UPDATE:
				return <SkuUpdateModalNoti />;
			case EventNoti.CATEGORY_UPDATE:
				return <CategoryUpdateModalNoti />;
			case EventNoti.UNIT_UPDATE:
				return <ProductUnitUpdateModalNoti />;
			case EventNoti.SUPPLIER_UPDATE:
				return <SupplierUpdateModalNoti />;
			case EventNoti.PRODUCT_UPDATE:
				return <ProductUpdateModalNoti />;
			case EventNoti.ORDER_CONFIRM:
				return <OrderComfirmModalNoti />;
			case EventNoti.PRODUCT_SOLD_OUT:
				return <ProductSoudOutModalNoti />;
			case EventNoti.ORDER_RETURN_CONFIRM:
				return <OrderReturnModal />;
			case EventNoti.ORDER_DELIVERY_FAILED:
				return <OrderDeliveryFailedModal />;
		}
	}
}
