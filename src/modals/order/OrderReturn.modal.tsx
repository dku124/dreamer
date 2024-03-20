import {Col, Form, Input, InputNumber, Modal, ModalProps, Row} from "antd";
import {orderSelector} from "@store/order/order.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {OrderDetail} from "@/@types/order/detail.type.ts";
import {AppDispatch} from "@store/store.ts";
import OrderThunk from "@store/order/order.thunk.ts";

export function OrderReturnModal(props:ModalProps) {
	const [form] = Form.useForm()
	const order = useSelector(orderSelector)
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		if (props.open) {
			form.setFieldsValue({
				details: order?.detail?.details?.map((detail:OrderDetail) => {
					const product = (detail.product as any)[0];
					return {
						id: detail._id,
						productName: `${product?.name}-${detail.color.color}-${detail.color.size.size}`,
						damaged: 0,
						quantity: detail.quantity,
					}
				})
			})
			
		}
	}, [props.open]);
	const onFinish = (values:any) => {
		dispatch(OrderThunk.ReturnedOderShip({
			id: order?.select?._id || "",
			data:values
		}))
		if (props.onCancel)
		{
			props.onCancel(undefined as  any)
		}
	}
	
	
	
	return (
		<Modal {...props} title={"Xác nhận hoàn đơn hàng"} width={720} onOk={form.submit}>
			<Form form={form} layout={"vertical"} onFinish={onFinish}>
				<Form.List name={"details"}>
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index) => (
								<Row>
									<Col span={14}>
										<Form.Item label={"Tên sản phẩm"} name={[field.name,'productName']}>
											<Input disabled={true} />
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item label={"Số lượng"} name={[field.name,"quantity"]}>
											<Input disabled={true} />
										</Form.Item>
									</Col>
									<Col span={5}>
										<Form.Item label={"Số lượng hư hại"} name={[field.name,"damaged"]}>
											<InputNumber style={{width:"100%"}} min={0} max={order?.detail?.details[field.name].quantity || 1}  defaultValue={0} />
										</Form.Item>
									</Col>
								</Row>
							))}
						</>
					)}
				</Form.List>
				<Form.Item label={"Lý do hoàn hàng"} name={"reason"} rules={[{type:"string",min:1,message:'Vui lòng điền lý do'}]}>
					<Input.TextArea />
				</Form.Item>
			</Form>
		</Modal>
	)
}