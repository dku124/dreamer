import {useSelector} from "react-redux";
import {notiSelector} from "@store/noti/noti.slice.ts";
import {useForm} from "antd/es/form/Form";
import {Order} from "@/@types/order/order.type.ts";
import {Col, Row} from "antd";
import {NumberUtil} from "@utils/number.util.ts";

export function OrderReturnModal()
{
	const noti = useSelector(notiSelector);
	const [form] = useForm();
	const getOder = () => {
		if (noti.select) {
			const data = noti.select.data[0] as Order;
			return data;
		}
	}

	return (
		<div>
			<Row gutter={[32, 20]}>
				<Col span={8}>
					<div>
						Tên khách hàng: <b>{getOder()?.ship.to.fullName}</b>
					</div>
				</Col>
				<Col span={8}>
					<div>
						Số điện thoại: <b>{getOder()?.ship.to.phone}</b>
					</div>
				</Col>
				<Col span={24}>
					<div>
						Địa chỉ: <b>{getOder()?.ship.to.address}</b>
					</div>
				</Col>
				<Col span={24}>
					{
						getOder()?.details.map((item,index) => {
							return (
								<div key={index}>
									<Row gutter={[32, 20]}>
										<Col span={8}>
											<div>
												Tên sản phẩm: <b>{item.product.name}</b>
											</div>
										</Col>
										<Col span={8}>
											<div>
												Số lượng: <b>{NumberUtil.toNumberMoney(item.quantity)}</b>
											</div>
										</Col>
										<Col span={8}>
											<div>
												Giá: <b>{NumberUtil.toNumberMoney(item.price)}</b>
											</div>
										</Col>

									</Row>
								</div>
							)
						})
					}
				</Col>
			</Row>
		</div>
	);
}