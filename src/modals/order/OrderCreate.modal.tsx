import {Col, Form, Modal, ModalProps, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {productSelector} from "@store/product/product.slice.ts";
import OrderShip from "@components/order/OrderShip.tsx";
import {OrderProduct} from "@components/order/OrderProduct.tsx";
import OrderDescription from "@components/order/OrderDescription.tsx";
import {OrderSetting} from "@components/order/OrderSetting.tsx";
import {OrderPriceInfo} from "@components/order/OrderPriceInfo.tsx";
import {AlertUtil} from "@utils/alert.util.ts";
import {OrderType} from "@/@types/order/order.type.ts";
import {AppDispatch} from "@store/store.ts";
import OrderThunk from "@store/order/order.thunk.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {useEffect} from "react";

export function OrderCreateModal(props:ModalProps) {
	
	const product = useSelector(productSelector)
	const [form] = Form.useForm()
	const dispatch = useDispatch<AppDispatch>()
	
	const onFinish = (values:any) => {
		if ( !values?.details  || values?.details?.length == 0) {
			AlertUtil.Warning("Vui lòng chọn sản phẩm")
			return;
		}
		
		if (!values.ship?.to?.province) {
			AlertUtil.Warning("Vui lòng chọn tỉnh thành")
			return;
		}
		
		if (!values.ship?.to?.district) {
			AlertUtil.Warning("Vui lòng chọn quận huyện")
			return;
		}
		
		if (!values.ship?.to?.ward) {
			AlertUtil.Warning("Vui lòng chọn phường xã")
			return;
		}
		if (!values.ship?.pickUpDate) {
			AlertUtil.Warning("Vui lòng chọn ngày lấy hàng")
			return;
		}
		const data = OrderHelper.toJson(values)
		dispatch(OrderThunk.create(data))
		
		if (props.onCancel)
		{
			props.onCancel(undefined as any)
		}
	}


	useEffect(() => {
		if (!props.open) {
			form.resetFields()
		}
	}, [props.open]);
	
	return (
		<div>
			<Modal {...props} width={1680} title={"Thêm đơn hàng"} onOk={form.submit}>
				<Form layout={"vertical"} form={form} onFinish={onFinish} >
					<Row gutter={[32,32]}>
						<Col span={12}>
							<OrderShip form={form}/>
						</Col>
						<Col span={12}>
							<OrderProduct form={form}/>
							<OrderDescription/>
							<OrderSetting form={form} type={OrderType.CUSTOM}/>
							<OrderPriceInfo form={form}/>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	)
}