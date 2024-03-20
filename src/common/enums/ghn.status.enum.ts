export enum GhnStatus {
	ready_to_pick="ready_to_pick", // Mới tạo đơn hàng
	picking="picking", // Nhân viên đang lấy hàng
	cancel="cancel", // Đơn hàng bị hủy
	money_collect_picking="money_collect_picking", // Đơn hàng đang được lấy đi thu tiền
	picked="picked", // Nhân viên đã lấy hàng
	storing="storing", // Đơn hàng đang được lưu kho
	transporting="transporting", // Đơn hàng đang được vận chuyển
	sorting="sorting", // Đơn hàng đang được sắp xếp
	delivering="delivering", // Đơn hàng đang được giao
	money_collect_delivering="money_collect_delivering", // Nhân viên đang thu tiền người nhận
	delivered="delivered", // Nhân viên đã giao hàng thành công
	delivery_failed="delivery_failed", // Giao hàng không thành công
	waiting_to_return="waiting_to_return", // Đơn hàng đang chờ hoàn
	return="return", // Đơn hàng đã được hoàn
	return_transporting="return_transporting", // Đang luân chuyển hàng trả
	return_sorting="return_sorting", // Đang phân loại hàng trả
	returning="returning", // Nhân viên đang đi trả hàng
	return_fail="return_fail", // Trả hàng không thành công,
	returned="returned", // Đã trả hàng thành công
	exception="exception", // Đơn hàng bị ngoại lệ
	damage="damage", // Đơn hàng bị hư hỏng
	lost="lost", // Đơn hàng bị mất
}

