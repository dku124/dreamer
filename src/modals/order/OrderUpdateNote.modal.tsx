import {Form, Input, Modal, ModalProps} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {orderSelector} from "@store/order/order.slice.ts";
import {useEffect} from "react";
import {AppDispatch} from "@store/store.ts";
import OrderThunk from "@store/order/order.thunk.ts";

export function OrderUpdateNoteModal(props:ModalProps)
{
	const [form] = Form.useForm();
	const order = useSelector(orderSelector)
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		form.setFieldsValue({note:order?.select?.note})
	}, []);
	
	const onFinish = (values:any) => {
		dispatch(OrderThunk.updateNoteOrder({
			id:order?.select?._id || "",
			note:values.note
		}))
		if (props.onCancel)
		{
			props.onCancel(undefined as any)
		}
	}
	
	return(
		<Modal {...props} title={"Ghi chú đơn hàng"} onOk={form.submit} okText={"Cập nhật"} cancelText={"Đóng"}>
			<Form form={form} onFinish={onFinish}>
				<Form.Item name={"note"}>
					<Input.TextArea/>
				</Form.Item>
			</Form>
		</Modal>
	)
}