import React, { useEffect } from "react";
import { Button, Col, Form, Input, Modal, ModalProps, Row, Space, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@store/store.ts";
import OrderThunk from "@store/order/order.thunk.ts";
import {
	orderSelector,
} from "@store/order/order.slice.ts";

export function ShipAsyncModal(props: ModalProps) {
	const order = useSelector(orderSelector);
	const dispatch = useDispatch<AppDispatch>();
	const [form] = Form.useForm();


	const onFinish = (values: any) => {
		if (order) {
			dispatch(
				OrderThunk.ShipAsync({
					order_code: ( order.select?.code || "").toString(),
					ship_code: values.shipCode,
				})
			);
			console.log(values.shipCode,order.select?.code)
		}
        if (props.onCancel)
		{
			props.onCancel(undefined as  any)
		}
	};

	return (
		<div>
			<Modal
				{...props}
				width={720}
				cancelText={"Đóng"}
				onOk={form.submit}
				title={"Đồng bộ đơn #" + order?.select?.code}
			>
				<Spin spinning={order.detail === undefined}>
					<Form layout="vertical" form={form} onFinish={onFinish}>
						<Row gutter={[32, 20]}>
							<Col span={12}>
								<Form.Item
									name="shipCode"
									label="Mã đơn vị vận chuyển"
									rules={[{ required: true, message: "Vui lòng nhập mã đơn vị vận chuyển" }]}
								>
									<Input />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Spin>
			</Modal>
		</div>
	);
}
