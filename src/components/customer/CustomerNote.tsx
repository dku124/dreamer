import {Form, Input, Modal, ModalProps} from "antd";
import {Label} from "@components/label/Label.tsx";
import {customerSelector} from "@store/customer/customer.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {AppDispatch} from "@store/store.ts";
import CustomerThunk from "@store/customer/customer.thunk.ts";

export function CustomerUpdateNoteModal(props:ModalProps)
{
	const customer = useSelector(customerSelector)
	const dispatch = useDispatch<AppDispatch>()
	const [form] = Form.useForm()
	useEffect(() => {
		if(props.open)
		{
			form.setFieldsValue({
				note:customer.select?.addOnInfo?.note || ""
			})
		}
	}, []);

	const onFinish = (values:any) => {
		dispatch(CustomerThunk.update({
			...customer.select,
			addOnInfo:{
				...customer.select?.addOnInfo,
				...values,
			}
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}


	return (
		<Modal {...props} title={"Cập nhật ghi chú"} okText={"Cập nhật"} cancelText={"Đóng"} onOk={form.submit}>
			<Form form={form} layout={"horizontal"} onFinish={onFinish}>
				
				<Form.Item name={"note"} label={<Label text={"Ghi chú"}  />  } >
					<Input.TextArea  placeholder={"Ghi chú"} />
				</Form.Item>
			</Form>
		</Modal>
	)
}